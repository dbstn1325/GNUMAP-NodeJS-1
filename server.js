const express = require("express");
const apiRouter = require("./src/routers/apiRouter.js");
const morgan = require("morgan");
const logger = morgan("dev");
const { render } = require("ejs");
const rootRouter = require("./src/routers/rootRouter");

const app = express();

// view 경로 설정
app.set("views", __dirname + "/src/views");
// 화면 engine을 ejs로 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.json());
app.use(express.urlencoded());
// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + "/public"));

//라우터 설정
app.use("/", rootRouter);
app.use("/api", apiRouter);

module.exports = app;
