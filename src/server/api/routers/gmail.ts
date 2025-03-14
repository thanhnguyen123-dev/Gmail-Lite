/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const SERVICE_ENDPOINT = "https://www.googleapis.com/gmail/v1/users";

export const gmailRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .query(async ({ctx}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${SERVICE_ENDPOINT}/me/profile`, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    }),
  getMessages: protectedProcedure
    .query(async ({ctx}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${SERVICE_ENDPOINT}/me/messages`, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    }),
  getMessage: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
      const response = await fetch(`${SERVICE_ENDPOINT}/me/messages/${input.id}`, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    }),
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
      if (!ctx.session.accessToken) {
        throw new Error("No access token found");
      }
    }),
});
