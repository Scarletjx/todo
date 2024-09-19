import { app } from "./app";
import sequelize from "./dbConfig";

// Sync database and start the server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected and synced");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
