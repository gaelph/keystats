const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static(path.join(__dirname, "..", "data")));

app.get("/", (req, res, next) => {
  res.send("OK");
});

app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
  }
});
