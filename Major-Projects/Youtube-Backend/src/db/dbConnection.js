import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
      // "mongodb+srv://pramodacharya808:UMtRy2Q8i1ggc5kV@cluster0.pehnb90.mongodb.net"
    );
    console.log(
      `MONGODB CONNECTED SUCCESSFULLY\nHOST: ${connect.connection.host}`
    );
    console.log("Application running ....");
  } catch (error) {
    console.log("MONGODB CONNECTON FAILED !", error);
    process.exit(1);
  }
};

export default connectDb;
