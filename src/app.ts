import fastify from "fastify";
import cookiee from "@fastify/cookie";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();
app.register(cookiee);
app.register(transactionsRoutes, {
  prefix: "transactions",
});
