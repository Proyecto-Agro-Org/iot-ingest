import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../common/http-error.js";

// Log unknown routes so misconfigured webhooks are easy to spot.
export const notFound: RequestHandler = (req, res) => {
  console.warn("404", req.method, req.originalUrl);
  res.status(404).json({ ok: false, error: `No route for ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    console.warn(err.status, err.message, JSON.stringify(err.details ?? null));
    res.status(err.status).json({ ok: false, error: err.message, received: err.details });
    return;
  }
  console.error(err);
  res.status(500).json({ ok: false, error: (err as Error).message ?? "Internal error" });
};
