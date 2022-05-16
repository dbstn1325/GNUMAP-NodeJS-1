const express = require("express");
const { DEC8_BIN } = require("mysql/lib/protocol/constants/charsets");
const rootRouter = express.Router();

const {db} = require('../db/convenient'); //db연동


rootRouter.get("/", (req, res, next) => {
  const sql = `SELECT * FROM convenient`;
  db.query(sql, (err, rows) => {
    if(err) {
      console.log(err);
    }
    console.log(rows);
    return res.render("main.html", { title: "hi" });
  });
});

rootRouter.get("/convenience", (req, res) => {
  return res.render("convenient.html");
});

module.exports = rootRouter;
