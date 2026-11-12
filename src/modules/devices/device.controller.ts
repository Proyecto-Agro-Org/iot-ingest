import { Router, type Request, type Response } from "express";
import { toDeviceStatusDto, type DeviceStatusResponseDto } from "./device.dto.js";
import { DeviceService } from "./device.service.js";

export class DeviceController {
  readonly router = Router();

  constructor(private readonly service = new DeviceService()) {
    this.router.post("/iot-device-status", this.saveStatus);
  }

  private saveStatus = async (req: Request, res: Response<DeviceStatusResponseDto>) => {
    const dto = toDeviceStatusDto(req.body, req.query);
    const created = await this.service.saveStatus(dto);
    res.status(200).json({ ok: true, clientid: dto.clientid, created });
  };
}
