import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));

app.use(express.static("public/static"));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ROUTER SETUP
import router from "./routes/user.route.js";

const apiVersion = process.env.API_VER;

app.use(`${apiVersion}/user`, router);

app.get(`${apiVersion}/test`, (req, res) => {
  res.send("HELLO WORLD");
});
