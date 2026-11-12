import express from "express";
import { bodyParser } from "./middlewares/body-parser.js";
import { requestLogger } from "./middlewares/request-logger.js";
import { stripApiPrefix } from "./middlewares/api-prefix.js";
import { errorHandler, notFound } from "./middlewares/error-handler.js";
import { routes } from "./routes.js";

const app = express();

app.use(bodyParser);
app.use(requestLogger);
app.use(stripApiPrefix);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
