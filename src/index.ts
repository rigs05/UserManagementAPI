import express from "express";
const app = express();
import "dotenv/config";
import { dbConnection } from "./config/DBConnection";
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
import router from "./routes/index";

(async () => {
  try {
    await dbConnection(DB_URL as string);

    app.use(express.json());
    app.use("/api", router);

    const connection = app.listen(PORT, () => {
      console.log(`Server Connected to Port ${PORT}.`);
      connection.on("error", (error) => {
        return console.error("Error while connecting to server.\n", error);
      });
    });
  } catch (err) {
    console.error("Error while starting server.", err);
  }
})();
