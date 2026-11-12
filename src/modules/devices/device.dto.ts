import { BadRequestError } from "../../common/http-error.js";
import { asObject, asString, isObject, tryParseJson, type JsonObject } from "../../common/utils.js";

/**
 * Input for POST /iot-device-status: any JSON object with a device identifier.
 * The body is stored exactly as received; `clientid` is only used to find
 * the device's document.
 */
export interface DeviceStatusDto {
  clientid: string;
  data: JsonObject;
}

/** Stored document: the merged bodies as-is plus server metadata (prefixed with `_`). */
export type DeviceDocument = JsonObject & {
  clientid: string;
  _createdAt: Date;
  _lastSeen: Date;
};

export interface DeviceStatusResponseDto {
  ok: true;
  clientid: string;
  created: boolean;
}

/** Accepts non-empty strings and numbers (converted to string). */
function asId(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return asString(value)?.trim() || undefined;
}

/** Looks for the device id in common field names, inside `payload`, or in ?clientid=. */
function resolveClientId(body: JsonObject, query: JsonObject): string | undefined {
  const nested = asObject(tryParseJson(body.payload));
  const candidates = [
    body.clientid, body.clientId, body.client_id, body.deviceId, body.device_id, body.id,
    nested.clientid, nested.clientId, nested.deviceId, nested.device_id,
    query.clientid,
  ];
  return candidates.map(asId).find(Boolean);
}

export function toDeviceStatusDto(body: unknown, query: unknown = {}): DeviceStatusDto {
  if (!isObject(body)) throw new BadRequestError("body must be a JSON object", body);
  const clientid = resolveClientId(body, asObject(query));
  if (!clientid) throw new BadRequestError("clientid is required", body);
  return { clientid, data: body };
}
