import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import todoRoutes from "./todo.routes";
import sequelize from "./dbConfig";

// Create Express app
export const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", todoRoutes);

// Serve static files from the React app (build folder)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });
}

// Export app without starting the server so it can be used in tests
export default app;
