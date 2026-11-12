import { getDb } from "../../database/mongo.js";
import { env } from "../../config/env.js";
import type { MeasurementDocument } from "./measurement.dto.js";

export class MeasurementRepository {
  private async collection() {
    return (await getDb()).collection<MeasurementDocument>(env.measurementsCollection);
  }

  async insert(doc: MeasurementDocument): Promise<string> {
    const result = await (await this.collection()).insertOne(doc);
    return result.insertedId.toString();
  }
}
