import express from "express";
import path from "path";
import url from "url";
import cors from "cors";
const app = express();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static(path.join(__dirname, "..", "data")));

app.get("/", (req, res /*  next */) => {
  res.send("OK");
});

app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      `You can access the app at http://localhost:${process.env.PORT || 5000}`
    );
  }
});
