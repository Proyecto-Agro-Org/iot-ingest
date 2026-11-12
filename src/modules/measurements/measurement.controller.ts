import { Router, type Request, type Response } from "express";
import { toIngestMessageDto, type IngestResponseDto } from "./measurement.dto.js";
import { MeasurementService } from "./measurement.service.js";

export class MeasurementController {
  readonly router = Router();

  constructor(private readonly service = new MeasurementService()) {
    this.router.post("/ingest", this.ingest);
  }

  private ingest = async (req: Request, res: Response<IngestResponseDto>) => {
    const dto = toIngestMessageDto(req.body);
    const id = await this.service.ingest(dto);
    res.status(201).json({ ok: true, id });
  };
}
