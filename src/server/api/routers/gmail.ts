/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";

const SERVICE_ENDPOINT = "https://www.googleapis.com/gmail/v1/users";

export const gmailRouter = createTRPCRouter({
  getThreads: protectedProcedure
    .input(z.object({
      maxResults: z.number().optional(),
      pageToken: z.string().optional(),
      q: z.string().optional(),
      labelIds: z.array(z.string()).optional(),
      includeSpamTrash: z.boolean().optional(),
    }))
    .query(async ({ctx, input}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${SERVICE_ENDPOINT}/me/threads`, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      });
      const params = new URLSearchParams();
      if (input.maxResults) {
        params.set('maxResults', input.maxResults.toString());
      }
      if (input.pageToken) {
        params.set('pageToken', input.pageToken);
      }
      if (input.q) {
        params.set('q', input.q);
      }
      if (input.labelIds) {
        params.set('labelIds', input.labelIds.join(','));
      }
      if (input.includeSpamTrash) {
        params.set('includeSpamTrash', input.includeSpamTrash.toString());
      }
      const data = await response.json();

      return data;
    }),
  getThread: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const response = await fetch(`${SERVICE_ENDPOINT}/me/threads/${input.id}`, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    }),
  syncEmails: protectedProcedure
    .mutation(async ({ctx}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }

      const user = await db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        }
      })

      let pageToken: string | undefined;
      let totalProcessed = 0;

      const batchSize = 100;

      try {
        do {
          const threadListResponse = await fetch(`${SERVICE_ENDPOINT}/me/threads`, {
            headers: {
              Authorization: `Bearer ${ctx.session.accessToken}`,
            },
          });

          const threadListData = await threadListResponse.json();
          for (const thread of threadListData.threads ?? []) {
            const threadResponse = await fetch(`${SERVICE_ENDPOINT}/me/threads/${thread.id}`, {
              headers: {
                Authorization: `Bearer ${ctx.session.accessToken}`,
              },
            });
            const threadData = await threadResponse.json();
            
            await db.thread.upsert({
              where: { id: threadData.id },
              create: {
                id: threadData.id,
                snippet: threadData.snippet ?? '',
                historyId: threadData.historyId ?? '',
                userId: user?.id ?? '',
                messages: {
                  create: threadData.messages?.map((message: any) => ({
                    id: message.id,
                    labelIds: message.labelIds,
                    snippet: message.snippet ?? '',
                    historyId: message.historyId ?? '',
                    internalDate: message.internalDate ?? '',
                    raw: message.raw ?? '',
                  }))
                }
              },
              update: {
                snippet: threadData.snippet ?? '',
                historyId: threadData.historyId ?? '',
                messages: {
                  deleteMany: {},
                  create: threadData?.messages?.map((message: any) => ({
                    id: message.id,
                    labelIds: message.labelIds,
                    snippet: message.snippet ?? '',
                    historyId: message.historyId ?? '',
                    internalDate: message.internalDate ?? '',
                    raw: message.raw ?? '',
                  }))
                }
              }
            });

            totalProcessed++;
          }
          pageToken = threadListData.nextPageToken;
        } while (pageToken);

        return {
          success: true,
          totalSynced: totalProcessed,
        }
      } catch (error) {
        console.error('Error syncing emails:', error);
        throw error;
      }
      
    })
  
});
