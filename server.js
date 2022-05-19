const express = require("express");
const morgan = require("morgan");
const logger = morgan("dev");
const { render } = require("ejs");
const PORT = 8000;
const mysql = require("mysql2");
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





const db = mysql.createConnection({
    host: "gnumap-mysql",
    user: "root",
    password: "gnumappbl",
    database: "gnumap",
});

db.connect((err)=> {
  if(err) {
      console.log(err.message);
  }
});

//서버 실행: npm run start
app.listen(PORT, () => {
  console.log(`listenling ${PORT}`);
});

// 'INSERT INTO building VALUES(?,?,?,?,?,?)', params,
// const params = [1, 'cu 편의점', "t", "t", "t", "t"]
// select * from building
// db.query('UPDATE building SET building_image = "/img/30.jpg" where building_num=1',
//라우터 설정
app.get("/", (req, res) => {
    //delete from building
    // const params = [501, '수의대', "/img/수의대.jpg", "경상남도 진주시 진주대로 501", "35.15041826233098", "128.09719375374283"]
    // db.query('INSERT INTO building VALUES(?,?,?,?,?,?)', params,
    db.query('select * from building',
      function(err,result, filed) {
        console.log(result);
    });
    return res.render("main.html", { title: "hi" });
  });

app.get("/find/:lat/:lng/:building_num", (req, res) => {
    let { lat, lng } = req.params;
    console.log('lat',lat,'lng',lng);
    return res.render("pathInfo.html", { lat: lat, lng: lng});
  });

