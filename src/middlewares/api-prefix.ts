import type { RequestHandler } from "express";

// Serve the same routes under /api/* too.
export const stripApiPrefix: RequestHandler = (req, _res, next) => {
  if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
  next();
};
