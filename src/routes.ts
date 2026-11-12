import { Router } from "express";
import { SystemController } from "./modules/system/system.controller.js";
import { MeasurementController } from "./modules/measurements/measurement.controller.js";
import { DeviceController } from "./modules/devices/device.controller.js";

export const routes = Router();
routes.use(new SystemController().router);
routes.use(new MeasurementController().router);
routes.use(new DeviceController().router);
