import express from "express";
import path from "path";
import url from "url";
import cors from "cors";
const app = express();

import keyboardController from "./controllers/keyboard.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

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

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static(path.join(__dirname, "..", "data")));

app.get("/", (req, res /*  next */) => {
  res.send("OK");
});

app.use("/api/keyboards", keyboardController);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `You can access the app at http://localhost:${process.env.PORT || 5000}`,
  );
});
