const express = require("express");
const apiRouter = require("./src/routers/apiRouter.js");
const morgan = require("morgan");
const logger = morgan("dev");
const { render } = require("ejs");
const rootRouter = require("./src/routers/rootRouter");

const MYSQLStore = require('express-mysql-session');
const session = require('express-session');


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
app.use(morgan('dev'));



//세션
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: new MYSQLStore({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1234",
      database: "convenience_db"
    })
  })
);





//라우터 설정
app.use("/", rootRouter);
app.use("/api", apiRouter);

module.exports = app;
