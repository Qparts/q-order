const express = require("express");
const cors = require("cors");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/messages");

env.config();

app.use(express.json());
app.use(cors());

const isProd = process.env.MONGODB_HOST !== "localhost";
console.log(isProd);
const db_connection_Url = isProd
  ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_CHAT_DB}`
  : `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_CHAT_DB}`;

console.log(db_connection_Url);
const options = isProd
  ? {
      useNewUrlParser: true,
      auth: {
        authSource: "admin",
      },
      ssl: true,
      sslValidate: false,
      sslCA: fs.readFileSync(`${process.env.MONGODB_CERT_FILE}`),
    }
  : {};

mongoose
  .connect(db_connection_Url, options)
  .then(() => console.log("Connected to MongoDB...."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use("/conversation", conversationRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("hello world!");
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
