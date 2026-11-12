import { BadRequestError } from "../../common/http-error.js";
import { isObject, type JsonObject } from "../../common/utils.js";

/**
 * Input for POST /ingest: any JSON object. It is stored exactly as received,
 * no fixed schema.
 */
export type IngestMessageDto = JsonObject;

/** Stored document: the body as-is plus server metadata (prefixed with `_`). */
export type MeasurementDocument = JsonObject & {
  _receivedAt: Date;
};

export interface IngestResponseDto {
  ok: true;
  id: string;
}

export function toIngestMessageDto(body: unknown): IngestMessageDto {
  if (!isObject(body)) throw new BadRequestError("body must be a JSON object", body);
  if (Object.keys(body).length === 0) throw new BadRequestError("body is empty", body);
  return body;
}
