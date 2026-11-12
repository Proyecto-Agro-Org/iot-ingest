import type { DeviceStatusDto } from "./device.dto.js";
import { DeviceRepository } from "./device.repository.js";

export class DeviceService {
  constructor(private readonly repository = new DeviceRepository()) {}

  /**
   * Saves the body as-is into the device's document (one per clientid).
   * Fields in the new message overwrite old ones; missing fields are kept.
   * Returns true if the device was new.
   */
  async saveStatus(dto: DeviceStatusDto): Promise<boolean> {
    const { _id, ...data } = dto.data; // _id is managed by Mongo
    return this.repository.mergeByClientId(dto.clientid, data, new Date());
  }
}
