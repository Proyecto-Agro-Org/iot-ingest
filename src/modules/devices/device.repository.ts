import { getDb } from "../../database/mongo.js";
import { env } from "../../config/env.js";
import type { JsonObject } from "../../common/utils.js";
import type { DeviceDocument } from "./device.dto.js";

// Created once per process: guarantees one document per clientid even with concurrent upserts.
let indexReady: Promise<unknown> | null = null;

export class DeviceRepository {
  private async collection() {
    const col = (await getDb()).collection<DeviceDocument>(env.devicesCollection);
    indexReady ??= col.createIndex({ clientid: 1 }, { unique: true }).catch((err) => {
      indexReady = null;
      console.error("could not create clientid index", err);
    });
    await indexReady;
    return col;
  }

  /**
   * Merges `data` into the device document, creating it if missing.
   * Uses a pipeline update with $literal so any structure is stored verbatim
   * (keys with dots, values starting with "$", etc.). Returns true if created.
   */
  async mergeByClientId(clientid: string, data: JsonObject, now: Date): Promise<boolean> {
    const result = await (await this.collection()).updateOne(
      { clientid },
      [
        {
          $replaceWith: {
            $mergeObjects: [
              "$$ROOT",
              { $literal: data },
              { clientid, _lastSeen: now, _createdAt: { $ifNull: ["$_createdAt", now] } },
            ],
          },
        },
      ],
      { upsert: true },
    );
    return result.upsertedCount === 1;
  }
}
