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
import { BasicEvaluatedExpression } from "next/dist/compiled/webpack/webpack";

const EmlParser = require('eml-parser')
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
      });
      return thread;
    }),
  getMessages: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const messages = await ctx.db.message.findMany({
        where: { threadId: input.id },
      });
      return messages;
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
        const params = new URLSearchParams({
          maxResults: batchSize.toString(),
          labelIds: 'INBOX',
          includeSpamTrash: 'false',
        });
        if (pageToken) {
          params.set('pageToken', pageToken);
        }
        const threadListResponse = await fetch(`${SERVICE_ENDPOINT}/me/threads?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
          },
        });

        const threadListData = await threadListResponse.json();
        for (const thread of threadListData.threads ?? []) {
          const threadResponse = await fetch(`${SERVICE_ENDPOINT}/me/threads/${thread.id}?${"format=full"}`, {
            headers: {
              Authorization: `Bearer ${ctx.session.accessToken}`,
            },
          });
          const threadData = await threadResponse.json();

          for (const message of threadData.messages ?? []) {
            const messageResponse = await fetch(`${SERVICE_ENDPOINT}/me/messages/${message.id}?${"format=raw"}`, {
              headers: {
                Authorization: `Bearer ${ctx.session.accessToken}`,
              },
            });
            const messageData = await messageResponse.json();
            message.raw = messageData.raw;
          }
          
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
      

        return {
          success: true,
          totalSynced: totalProcessed,
        }
      } catch (error) {
        console.error('Error syncing emails:', error);
        throw error;
      }
      
    }),
  
  parseEmail: protectedProcedure
    .input(z.object({raw: z.string()}))
    .query(async ({input}) => {
      let base64 = input.raw.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      const parser = new EmlParser(decoded);
      return new Promise((resolve, reject) => {
        parser.parse((error: any, parsed: any) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            html: parsed.html,
            text: parsed.text,
            subject: parsed.subject,
            from: parsed.from,
            to: parsed.to,
            date: parsed.date,
            // attachments: parsed.attachments,
          });
        });
      });
    }),
});
