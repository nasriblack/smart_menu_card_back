// src/index.ts
import express from "express";
import dotenv from "dotenv";
import chatRoute from "./routes/chat";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.disable("x-powered-by");
app.use(cors());

app.use("/chat", chatRoute);
app.use("/status", (_, res: any) => {
  return res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
