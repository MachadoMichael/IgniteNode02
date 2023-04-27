import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request, reply) => {});

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions")
        .select()
        .where("session_id", sessionId);
      return { transactions };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const transactions = await knex("transactions")
      .where({
        session_id: sessionId,
        id,
      })
      .first();
    return { transactions };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amout", { as: "amount" })
        .first();

      return { summary };
    }
  );

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
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
};
