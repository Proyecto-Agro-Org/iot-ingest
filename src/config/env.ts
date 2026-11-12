// Centralized configuration. Read lazily so missing vars fail per request, not at boot.
export const env = {
  get mongoUri(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    return uri;
  },
  mongoDb: process.env.MONGODB_DB || "iot_sensores",
  measurementsCollection: process.env.MONGODB_COLLECTION || "mediciones",
  devicesCollection: process.env.MONGODB_DEVICES_COLLECTION || "dispositivos",
  port: Number(process.env.PORT) || 3000,
};
