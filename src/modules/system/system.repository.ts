import { getDb } from "../../database/mongo.js";

export class SystemRepository {
  async ping(): Promise<void> {
    await (await getDb()).command({ ping: 1 });
  }

  async stats(): Promise<{ database: string; counts: Record<string, number> }> {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    const counts: Record<string, number> = {};
    for (const c of collections) {
      counts[c.name] = await db.collection(c.name).estimatedDocumentCount();
    }
    return { database: db.databaseName, counts };
  }
}
