import "dotenv/config";
import express from "express";

import authRouter from "./routes/authRoutes.js";
import marketRouter from "./routes/marketRoutes.js";
import resolveRouter from "./routes/resolveRoutes.js";
import { connectToMongoDB, disconnectFromMongoDB } from "./db/db.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/market", marketRouter);
app.use("/api/v1/resolve", resolveRouter);

async function main() {
  await connectToMongoDB();

  console.log("MongoDB connected");

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
  });
}

main().catch(async (error) => {
  console.error("Application failed to start:", error);

  await disconnectFromMongoDB();
});
