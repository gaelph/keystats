import express from "express";
import path from "path";
import cors from "cors";
const app = express();

import keyboardController from "./controllers/keyboard.js";
import log from "../lib/logger.js";

const logger = log.getLogger("Server");

process
  .on("uncaughtException", (err: unknown) => {
    console.error(err);
  })
  .on("unhandledRejection", (err: unknown) => {
    console.error(err);
  });

app.use(
  cors({
    origin: "*",
  }),
);

const staticFolder = path.join(__dirname, "client");
logger.debug("serving static folder", staticFolder);
app.use(express.static(staticFolder));

app.get("/", (req, res /*  next */) => {
  res.send("OK");
});

app.use("/api/keyboards", keyboardController);

export default async function () {
  app.listen(process.env.PORT || 5000, () => {
    logger.info(
      `You can access the app at http://localhost:${process.env.PORT || 5000}`,
    );
  });
}
