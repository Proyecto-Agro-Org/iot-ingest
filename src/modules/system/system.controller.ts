import { Router, type Request, type Response } from "express";
import { SystemRepository } from "./system.repository.js";

// Health and diagnostics. Thin enough that it talks to the repository directly.
export class SystemController {
  readonly router = Router();

  constructor(private readonly repository = new SystemRepository()) {
    this.router.get("/", this.root);
    this.router.get("/health", this.health);
    this.router.get("/debug", this.debug);
  }

  private root = (_req: Request, res: Response) => {
    res.json({ ok: true, service: "ingest" });
  };

  private health = async (_req: Request, res: Response) => {
    try {
      await this.repository.ping();
      res.json({ ok: true, mongo: "up" });
    } catch (err) {
      res.status(500).json({ ok: false, error: (err as Error).message });
    }
  };

  /** Shows which database is in use and document counts (no secrets). */
  private debug = async (_req: Request, res: Response) => {
    res.json({ ok: true, ...(await this.repository.stats()) });
  };
}
