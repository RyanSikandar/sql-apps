const express = require("express");
const path = require("path");
const completed = require("./completed");
const recipes = require("./recipes/api");
const ingredients = require("./ingredients/api");
const movies = require("./paginationPractice")
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const app = express();
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
app.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "./style.css"))
);
app.get("/favicon.ico", (_, res) =>
  res.sendFile(path.join(__dirname, "./favicon.ico"))
);

app.use(express.json());
app.use("/images", express.static("./images"));
app.use("/completed", completed);
app.use("/recipes", recipes);
app.use("/ingredients", ingredients);
app.use("/movies", limiter, movies);

app.get("/hello", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("listening on http://localhost:" + PORT);
