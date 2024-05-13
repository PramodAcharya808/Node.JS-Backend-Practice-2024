// import dotenv from "dotenv";
// dotenv.config({ path: "./env" });
import "dotenv/config";
import connectDb from "./db/dbConnection.js";
import { app } from "./app.js";

// connectDb async function will return a promise
connectDb()
  .then(() => {
    app.on("error", (err) => {
      console.log("APPLICATION ERROR .. ", err);
      process.exit(1);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on port: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("ERROR CONNECTING TO MONGODB DATABASE !!", err);
  });
