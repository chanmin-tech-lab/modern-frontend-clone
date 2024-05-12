import app from "./app";

const port = process.env.PORT || 3000;

Bun.serve({
  port,
  //   port, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  fetch: app.fetch,
});

console.log("Server is running");
