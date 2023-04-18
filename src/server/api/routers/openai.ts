import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const openAiRouter = createTRPCRouter({
  getChatCompletion: publicProcedure
    .input(
      z.object({
        query: z.string(),
        formality: z.string(),
        decoration: z.string(),
      })
    )
    .query(async ({ input }) => {
      const getDecorationText = (text: string) => {
        switch (text) {
          case "minimal":
            return "and decorate it, but with a limit";
          case "maximum":
            return "and decorate it a lot, without overexaggerating it";
          default:
            return "";
        }
      };

      if (input.query !== "") {
        const modifiedInput = `I will give you some text and I want you to fix the grammar ${getDecorationText(
          input.decoration
        )}. The formality should be ${input.formality}. The text:
          ${input.query}`;

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: modifiedInput,
            },
          ],
          n: 1,
          temperature: 0.4,
          max_tokens: 200,
        });

        return completion.data;
      }

      return { choices: [{ message: { content: "" } }] };
    }),
});
