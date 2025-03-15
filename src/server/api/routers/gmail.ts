/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { parseRawEmail } from "~/server/utils/parseEmail";

const SERVICE_ENDPOINT = "https://www.googleapis.com/gmail/v1/users";

export const gmailRouter = createTRPCRouter({
  getThreads: protectedProcedure
    .query(async ({ctx}) => {
      const threads = await db.thread.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          messages: true,
        }
      });
      return threads;
    }),
  getThread: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const thread = await ctx.db.thread.findUnique({
        where: { id: input.id },
        include: {
          messages: true,
        }
      });
      return thread;
    }),
  getMessages: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const messages = await ctx.db.message.findMany({
        where: { threadId: input.id },
        select: {
          id: true,
          snippet: true,
          from: true,
          raw: true,
          subject: true,
          htmlBody: true,
          internalDate: true,
          to: true,
          date: true,
        }
      });
      return messages;
    }),
    syncEmails2: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
  
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
  
      let pageToken: string | undefined;
      let totalProcessed = 0;
      const batchSize = 100;
  
      try {
        const params = new URLSearchParams({
          maxResults: batchSize.toString(),
          labelIds: "INBOX",
          includeSpamTrash: "false",
        });
        if (pageToken) {
          params.set("pageToken", pageToken);
        }
  
        // Fetch list of threads
        const threadListResponse = await fetch(
          `${SERVICE_ENDPOINT}/me/threads?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${ctx.session.accessToken}`,
            },
          }
        );
        const threadListData = await threadListResponse.json();
  
        for (const thread of threadListData.threads ?? []) {
          // Fetch full thread details
          const threadResponse = await fetch(
            `${SERVICE_ENDPOINT}/me/threads/${thread.id}?format=full`,
            {
              headers: {
                Authorization: `Bearer ${ctx.session.accessToken}`,
              },
            }
          );
          const threadData = await threadResponse.json();
  
          // Process each message in the thread
          const messagesWithParsedData = await Promise.all(
            (threadData.messages ?? []).map(async (message: any) => {
              // Fetch raw message (format=raw)
              const messageResponse = await fetch(
                `${SERVICE_ENDPOINT}/me/messages/${message.id}?format=raw`,
                {
                  headers: {
                    Authorization: `Bearer ${ctx.session.accessToken}`,
                  },
                }
              );
              const messageData = await messageResponse.json();
  
              // Parse the raw message
              const parsed = await parseRawEmail(messageData.raw);
  
              return {
                id: message.id,
                labelIds: message.labelIds,
                snippet: message.snippet ?? "",
                historyId: message.historyId ?? "",
                internalDate: message.internalDate ?? "",
                raw: messageData.raw ?? "",
                subject: parsed.subject,
                htmlBody: parsed.html,
                from: parsed.from,
                to: parsed.to,
                date: parsed.date,
              };
            })
          );
  
          // Upsert the thread and its messages
          await db.thread.upsert({
            where: { id: threadData.id },
            create: {
              id: threadData.id,
              snippet: threadData.snippet ?? "",
              historyId: threadData.historyId ?? "",
              userId: user?.id ?? "",
              messages: {
                create: messagesWithParsedData,
              },
            },
            update: {
              snippet: threadData.snippet ?? "",
              historyId: threadData.historyId ?? "",
              messages: {
                deleteMany: {}, // Clear existing messages (you can optimize this later)
                create: messagesWithParsedData,
              },
            },
          });
  
          totalProcessed++;
        }
        pageToken = threadListData.nextPageToken;
  
        return {
          success: true,
          totalSynced: totalProcessed,
        };
      } catch (error) {
        console.error("Error syncing emails:", error);
        throw error;
      }
    }),
});
