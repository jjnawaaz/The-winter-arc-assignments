import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configure middleware and register application routes
 *
 * @returns - An Express application configured with JSON parsing, CORS, and API routes
 */
app.use(cors());
app.use(express.json());

// User routes
app.use("/user", userRoutes);

// Workspace routes
app.use("/workspace", workspaceRoutes);

// Task routes
app.use("/task", taskRoutes);

// Dashboard routes
app.use("/", dashboardRoutes);

/**
 * Start the Express server
 *
 * @param PORT - Port on which the server listens
 * @returns - Starts the server and logs the listening port
 */
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
