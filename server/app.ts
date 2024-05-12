import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();
// 모든 요청에 대하여 로그를 남긴다.
app.use("*", logger());

app.get("/", (context) => context.json({ message: "Hello!" }));

app.route("/api/expenses", expensesRoute);

export default app;
