const express = require("express");
const rootRouter = express.Router();

const {db} = require('../db/convenient'); //db연동


rootRouter.get("/", (req, res) => {
  // // const sql = `SELECT * FROM convenient`;
  // // db.query(sql, (err, rows) => {
  // //   if(err) {
  // //     console.log(err);
  // //   }
  // //   console.log(rows);
  return res.render("main.html", { title: "hi" });
  // // });
});

rootRouter.get("/convenience", (req, res) => {
  return res.render("convenient.html");
});

module.exports = rootRouter;
