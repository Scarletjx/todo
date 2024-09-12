import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import todoRoutes from "./routes/TodoRoutes";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", todoRoutes);

// Serve static files from the React app (build folder)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  // Handle any other routes, and serve the React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
