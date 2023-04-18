import { createTRPCRouter } from "~/server/api/trpc";
import { openAiRouter } from "~/server/api/routers/openai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  openAI: openAiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
