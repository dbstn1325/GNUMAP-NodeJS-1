const express = require("express");
const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  return res.render("main.html", { title: "hi" });
});
rootRouter.get("/convenience", (req, res) => {
  return res.render("convenient.html");
});

module.exports = rootRouter;
