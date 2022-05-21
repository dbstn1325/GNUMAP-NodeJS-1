const express = require("express");
const morgan = require("morgan");
const logger = morgan("dev");
const { render } = require("ejs");
const PORT = 8000;
const mysql = require("mysql2");
const app = express();
const fetch = require("node-fetch");
const http = require('http');



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

db.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db connected');
});



//서버 실행: npm run start
app.listen(PORT, () => {
  console.log(`listenling ${PORT}`);
});

// 'INSERT INTO building VALUES(?,?,?,?,?,?)', params,
// const params = [1, 'cu 편의점', "t", "t", "t", "t"]
// select * from building
// db.query('UPDATE building SET building_image = "/img/30.jpg" where building_num=1',
//delete from building
// const params = [501, '수의대', "/img/수의대.jpg", "경상남도 진주시 진주대로 501", "35.15041826233098", "128.09719375374283"]
// db.query('INSERT INTO building VALUES(?,?,?,?,?,?)', params,
// db.query('ALTER TABLE convenient add category varchar(30) not null',
// db.query('show full columns from convenient',


//라우터 설정
app.get("/", (req, res) => {
  db.query('select * from convenient',
    function (err, result, filed) {
      console.log(result);
    });
  return res.render("main.html", { title: "hi" });
});

// app.get("/find/:lat/:lng/:building_num", (req, res) => {
//     let { lat, lng } = req.params;
//     console.log('lat',lat,'lng',lng);
//     return res.render("pathInfo.html", { lat: lat, lng: lng});
//   });

app.get("/find/:lat/:lng/:num", (req, res) => {

  const { lat, lng, num } = req.params;

  try {
    const selectQuery = db.query(`SELECT * FROM building WHERE building_num = ${num}`,
      (err, result, filed) => {
        if (result == 0) {
          return res.send(
            `<script>
              alert('제공하지 않는 경로입니다.');
              location.href="/";
            </script>`
          );
        }
        if (err) {
          console.log(err);
        }
        return result.map((found) => {
          console.log(found);
          res.render("pathInfo.html", { lat: lat, lng: lng, tlat: found.building_lat, tlng: found.building_lag });
        }
        );
      });
  } catch {
    (err) => { 
      return console.log(err);
    };
  }

});


app.post("/find", (req, res)=> {
  const { lat, lng, num } = req.body;
  
  try {
    const selectQuery = db.query(`SELECT * FROM building WHERE building_num = ${num}`,
      (err, result, filed) => {
        if (result == 0) {
          return res.send(
            `<script>
              alert('제공하지 않는 경로입니다.');
              location.href="/";
            </script>`
          );
        }
        if (err) {
          console.log(err);
        }
        return result.map((found) => {
          console.log(found);
          res.render("pathInfo.html", { lat: lat, lng: lng, tlat: found.building_lat, tlng: found.building_lag });
        }
        );
      });
  } catch {
    (err) => { 
      return console.log(err);
    };
  }

});

//1.앱에서 위치 전송
app.post("/curLocation", (req,res) =>{
  const {lat, lng} = req.body;

  //현재 위치 반환
  return lat, lng;
})


app.get("/convenience", async(req, res)=> {
  //2.현재 위치 위도,경도 호출
  // const response = await fetch("currLocation", {
  //   method: "POST"
  // }).then(
  // (response)=> {
  //   const lat = response.lat;
  //   const lng = response.lng;
  // };
  
  const lat = 35.15767521048202;
  const lng = 128.10108675307046;
  const name = "편의점";
  const info = {};
  const distance = 0;

  return res.render('convenient2.html');
  //출발지점 고정.   에   모든 편의시설의 위도,경도

  // try {
  //   const selectQuery = db.query(`SELECT * FROM convenient WHERE category= "${name}" `,
  //     (err, result, filed) => {
  //       if (result == 0) {
  //         return res.send(
  //           `<script>
  //             alert('근처 편의점 정보가 존재하지 않습니다.');
  //             location.href="/";
  //           </script>`
  //         );
          
  //       }
  //       if (err) {
  //         console.log(err);
  //       }
  //       return res.render("convenient2.html");
  //       // return result.map((found) => {
  //       //   res.render("convenient2.html");
  //       //   // res.render("pathInfo2.html", {lat: found.convenient_lat, lng: found.convenient_lng});
  //       //   // console.log(found.convenient_name,found.convenient_lat, found.convenient_lng);
  //       // });
        
  //     });
  // } catch {
  //   (err) => { 
  //     return console.log(err);
  //   };
  // }
  
  
});

