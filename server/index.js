const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./router");
const errorMiddlewares = require("./middlewares/errorMiddlewares");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api", router);

app.use(errorMiddlewares);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    app.listen(PORT, console.log("Server startned on " + PORT));
  } catch (e) {
    console.error(e);
  }
};

start();
