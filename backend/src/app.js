import express from "express";
import routes from "./routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(routes);

export default app;
