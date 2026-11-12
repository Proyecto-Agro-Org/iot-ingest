import type { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, _res, next) => {
  const body = JSON.stringify(req.body ?? {}).slice(0, 1000);
  console.log(req.method, req.originalUrl, req.headers["content-type"] ?? "-", body);
  next();
};
