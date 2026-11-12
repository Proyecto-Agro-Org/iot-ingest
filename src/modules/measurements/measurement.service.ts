import type { IngestMessageDto, MeasurementDocument } from "./measurement.dto.js";
import { MeasurementRepository } from "./measurement.repository.js";

export class MeasurementService {
  constructor(private readonly repository = new MeasurementRepository()) {}

  /** Stores the message as-is, adding only the reception time. */
  async ingest(message: IngestMessageDto): Promise<string> {
    const { _id, ...data } = message; // let Mongo generate _id
    const doc: MeasurementDocument = { ...data, _receivedAt: new Date() };
    return this.repository.insert(doc);
  }
}
