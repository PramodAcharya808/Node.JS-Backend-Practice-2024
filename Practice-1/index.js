const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("WELCOME TO HOME PAGE");
});

app.get("/login", (req, res) => {
  res.send("<h1>Enter Email</h1><br/><h1>Enter Password</h1>");
});

app.listen(port, () => {
  console.log(`Backend is running on port: ${port}`);
});
