import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import todoRoutes from "./todo.routes";
import sequelize from "./dbConfig";

const app = express();

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

sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((err) => {
  console.error('Error connecting to the database: ', err);
});