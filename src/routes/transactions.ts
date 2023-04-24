import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get("/", async () => {
    const transactions = await knex("transactions").select();

    return { transactions };
  });

  app.get("/:id", async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const transactions = await knex("transactions").where("id", id).first();
    return { transactions };
  });

  app.get("/summary", async () => {
    const summary = await knex("transactions")
      .sum("amout", { as: "amount" })
      .first();

    return { summary };
  });

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amout: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amout, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7DAYS
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amout: type === "credit" ? amout : amout * -1,
    });

    return reply.status(201).send();
  });
};
