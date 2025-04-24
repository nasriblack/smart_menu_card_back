// src/routes/chat.ts
import express from "express";
import { verifySignature } from "../utils/auth";
// import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res): Promise<any> => {
  const { payload, signature } = req.body;

  // console.log("checking the payload", payload, signature);

  if (!payload || !signature) {
    return res.status(400).json({ error: "Missing payload or signature" });
  }

  const secretKey = process.env.SECRET_KEY!;
  const isValid = verifySignature(payload, signature, secretKey);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    console.log("checking iam in openRouter", openRouterRes);

    const data = await openRouterRes.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from OpenRouter" });
  }
});

export default router;
