import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

// source of truth
const expenseSchema = z.object({
  id: z.number(),
  title: z.string().min(3).max(10),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 50,
  },
  {
    id: 2,
    title: "Utilities",
    amount: 100,
  },
  {
    id: 3,
    title: "Rent",
    amount: 1000,
  },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    // const expense = c.req.valid("json");
    const expense = c.req.valid("json");
    // const expense = await c.req.json();
    console.log(expense);
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json({ expense });
  })
  //   .post("/", async (c) => {
  //     // any 타입이다
  //     const data = await c.req.json();
  //     // const expense = await c.req.json();

  //     // zod를 사용하면 요청 파라미터의 타입이 스키마를 만족해야만 한다.
  //     const expense = createPostSchema.parse(data);
  //     console.log(expense.amount);
  //     console.log({ expense });
  //     return c.json({ expense });
  //   });

  // 경로에 regex를 붙일 수 있다.
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((expense) => expense.id === id);

    if (!expense) {
      // 프라미스를 반환한다.
      return c.notFound();
      // 리턴하지 않는다. () => void
      // return c.status(404);
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.notFound();
    }

    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deletedExpense });
  });
