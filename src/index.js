import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./database/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`\n Server is runinig at PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Faild", error);
  });