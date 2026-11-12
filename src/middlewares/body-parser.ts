import express, { type RequestHandler } from "express";
import { tryParseJson } from "../common/utils.js";

// EMQX may omit or vary Content-Type, so read any body as text and parse JSON if possible.
const readText = express.text({ type: () => true, limit: "1mb" });

const parseJson: RequestHandler = (req, _res, next) => {
  if (typeof req.body === "string") {
    const text = req.body.trim();
    const parsed = text ? tryParseJson(text) : {};
    req.body = typeof parsed === "string" ? { payload: parsed } : parsed;
  }
  next();
};

export const bodyParser = [readText, parseJson];
