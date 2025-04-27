// src/routes/chat.ts
import express from "express";
import { verifySignature } from "../utils/auth";
import { endPoint } from "../utils/endPoints";
import { codeStatus } from "../utils/codeStatus";
// import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res): Promise<any> => {
  const { payload, signature } = req.body;

  // console.log("checking the payload", payload, signature);

  if (!payload || !signature) {
    return res
      .status(400)
      .json({ error: codeStatus.errorCode.MISSING_PAYLOAD });
  }

  const secretKey = process.env.SECRET_KEY!;
  const isValid = verifySignature(payload, signature, secretKey);

  if (!isValid) {
    return res
      .status(401)
      .json({ error: codeStatus.errorCode.INVALID_SIGNATURE });
  }

  try {
    const openRouterRes = await fetch(endPoint.OPEN_ROUTER_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    const data = await openRouterRes.json();
    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: codeStatus.errorCode.FAILED_TO_FETCH });
  }
});

export default router;
