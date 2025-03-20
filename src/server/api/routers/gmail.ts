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
import { s3Service } from "~/server/utils/s3Service";
const SERVICE_ENDPOINT = "https://www.googleapis.com/gmail/v1/users";
const BATCH_SIZE = 50;

export const gmailRouter = createTRPCRouter({
  getThreads: protectedProcedure
    .input(z.object({
      labelIds: z.string(),
    }))
    .query(async ({ctx, input}) => {
      const threads = await db.thread.findMany({
        where: {
          userId: ctx.session.user.id,
          messages: {
            some: {
              labelIds: {
                has: input.labelIds,
              },
            },
          },
        },
        include: {
          messages: true,
        },
        orderBy: {
          lastMessageDate: "desc",
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
          htmlUrl: true,
          internalDate: true,
          to: true,
          date: true,
        }
      });
      return messages;
    }),


  getMessagesWithHtml: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: { threadId: input.threadId },
        select: { id: true, htmlUrl: true }
      });

      const htmlMap: Record<string, string> = {};
      for (const message of messages) {
        if (message.htmlUrl) {
          const key = "emails/" + message.htmlUrl.split("emails/")[1];
          const html = await s3Service.fetchHtmlFromS3(key);
          if (html) htmlMap[message.id] = html;
        }
      }
      return htmlMap;
    }),

  sendEmail: protectedProcedure
    .input(z.object({
      to: z.string(),
      cc: z.string().optional(),
      subject: z.string(),
      body: z.string(),
      threadId: z.string().optional(),
    }))
    .mutation(async ({ctx, input}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }

      const emailLines = [
        `From: ${ctx.session.user.email}`,
        `To: ${input.to}`,
      ];
      
      if (input.cc) {
        emailLines.push(`Cc: ${input.cc}`);
      }

      emailLines.push(
        `Subject: ${input.subject}`,
        'Content-Type: text/plain; charset=utf-8',
      );

      if (input.threadId) {
        emailLines.push(`In-Reply-To: ${input.threadId}`);
        emailLines.push(`References: ${input.threadId}`);
      }

      emailLines.push("");
      emailLines.push(input.body);

      const encodedEmail = Buffer.from(emailLines.join("\n")).toString("base64");

      const response = await fetch(`${SERVICE_ENDPOINT}/me/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
        body: JSON.stringify({
          raw: encodedEmail,
          threadId: input.threadId,
        }),
      });

      const responseData = await response.json();
      return responseData;
      }),

  syncEmails: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.accessToken) {
      throw new Error("No access token found");
    }

    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        lastInboxPageToken: true,
        lastSentPageToken: true,
      }
    });

    let totalProcessed = 0;
    const labels = ["INBOX", "SENT"];
    
    try {
      for (const label of labels) {
        const params = new URLSearchParams({
          maxResults: BATCH_SIZE.toString(),
          labelIds: label,
          includeSpamTrash: "false",
        });

        if (label === "INBOX" && user?.lastInboxPageToken) {
          params.set("pageToken", user.lastInboxPageToken);
        } else if (label === "SENT" && user?.lastSentPageToken) {
          params.set("pageToken", user.lastSentPageToken);
        }

        console.log(`Fetching threads for label: ${label}`);

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
          const threadResponse = await fetch(
            `${SERVICE_ENDPOINT}/me/threads/${thread.id}?format=full`,
            {
              headers: {
                Authorization: `Bearer ${ctx.session.accessToken}`,
              },
            }
          );
          const threadData = await threadResponse.json();
        
          const messagesWithParsedData = await Promise.all(
            (threadData.messages ?? []).map(async (message: any) => {
              try {
                const messageResponse = await fetch(
                  `${SERVICE_ENDPOINT}/me/messages/${message.id}?format=raw`,
                  {
                    headers: {
                      Authorization: `Bearer ${ctx.session.accessToken}`,
                    },
                  }
                );
                const messageData = await messageResponse.json();

                const parsed = await parseRawEmail(messageData.raw, message.id);
                const htmlUrl = typeof parsed.html === 'string' ? parsed.html : null;

                return {
                  id: message.id,
                  labelIds: message.labelIds,
                  snippet: message.snippet ?? "",
                  historyId: message.historyId ?? "",
                  internalDate: new Date(Number(message.internalDate)) ?? "",
                  raw: messageData.raw ?? "",
                  subject: parsed.subject,
                  htmlUrl: htmlUrl,
                  from: parsed.from,
                  to: parsed.to,
                  date: parsed.date,
                };
              } catch (error) {
                console.error(`Error processing message ${message.id}:`, error);
                return {
                  id: message.id,
                  labelIds: message.labelIds ?? [],
                  snippet: message.snippet ?? "",
                  historyId: message.historyId ?? "",
                  internalDate: new Date(Number(message.internalDate)) ?? "",
                  raw: "",
                  subject: "",
                  htmlUrl: null,
                  from: "",
                  to: "",
                  date: new Date().toLocaleDateString(),
                };
              }
            })
          );

          let lastMessageDate: Date | null = null;
          for ( const message of messagesWithParsedData) {
            if (!lastMessageDate || message.internalDate > lastMessageDate) {
              lastMessageDate = message.internalDate;
            }
          }

          await db.thread.upsert({
            where: { id: threadData.id },
            create: {
              id: threadData.id,
              snippet: threadData.snippet ?? "",
              historyId: threadData.historyId ?? "",
              userId: user?.id ?? "",
              lastMessageDate: lastMessageDate ?? new Date(),
              messages: {
                create: messagesWithParsedData,
              },
            },
            update: {
              snippet: threadData.snippet ?? "",
              historyId: threadData.historyId ?? "",
              lastMessageDate: lastMessageDate ?? new Date(),
              messages: {
                deleteMany: {},
                create: messagesWithParsedData,
              },
            },
          });

          totalProcessed++;
        }

        if (threadListData.nextPageToken) {
          await db.user.update({
            where: { id: user?.id },
            data: label === "INBOX" 
              ? { lastInboxPageToken: threadListData.nextPageToken }
              : { lastSentPageToken: threadListData.nextPageToken }
          });
        } else {
          await db.user.update({
            where: { id: user?.id },
            data: label === "INBOX" 
              ? { lastInboxPageToken: null }
              : { lastSentPageToken: null }
          });
        }
      }

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
