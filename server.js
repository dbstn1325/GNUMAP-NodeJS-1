const express = require("express");
const morgan = require("morgan");
const logger = morgan("dev");
const { render } = require("ejs");
const PORT = 8000;
const mysql = require("mysql2");
const app = express();
const fetch = require("node-fetch");
const http = require('http');
const { type } = require("os");



// view 경로 설정
app.set("views", __dirname + "/src/views");
// 화면 engine을 ejs로 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.json());
app.use(express.urlencoded());
// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + "/public"));
// 전송 로그를 기록
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



//라우터 설정
app.get("/", (req, res) => {
  const num = "30";
  const num2 = "컴퓨터";
  db.query(`SELECT * FROM building WHERE building_num = ${num} OR building_name LIKE '%"${num2}"%'`,
    function (err, result, filed) {
      console.log(result);
    });
  return res.render("main.html", { title: "hi" });
});


app.post("/find", (req, res) => {
  const { lat, lng } = req.body;
  let { num } =req.body;
  num = num.replace(" ","");
  console.log(`find 도착: ${num}`);

  const query = [num, "%" + num +"%"];
  try {
    const selectQuery = db.query('SELECT * FROM building WHERE building_num = ? OR building_name LIKE ?; ', query, 
      (err, result, filed) => {
        if (result == 0) {
          return res.send("error");
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










app.post('/getInfoConvenient', (req, res) => {
  const { curLat, curLng, number } = req.body;
  let destLat = []; let destLng = []; let destName = [];
  const convenientCategory = {
    0: "편의점",
    1: "ATM",
    2: "우체국",
    3: "문구점",
    4: "AED",
    5: "딸기방",
    6: "식당",
    7: "프린터",
    8: "카페",
    9: "헌혈의집",
    };

  try {
    // const selectQuery = db.query(`SELECT * FROM convenient WHERE category = convenientCategory[${number}}]`,
    const selectQuery = db.query(`SELECT * FROM convenient WHERE category = convenientCategory[0]`,
      (err, result, filed) => {
        if (result == 0) {
          return res.send("error");

        }
        if (err) {
          console.log(err);
        }
        return result.map((found) => {
          destLat.push(found.convenient_lat);
          destLng.push(found.convenient_lng);
          destName.push(found.convenient_name);
        });

      });
  } catch {
    (err) => {
      return console.log(err);
    };
  }

  const info = {};
  const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1';
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appKey: 'l7xxfdc75c1509a74ecdba02bf5e024ee9d5'
    },
    body: JSON.stringify({
      angle: 0,
      speed: 0,
      reqCoordType: 'WGS84GEO',
      searchOption: '0',
      resCoordType: 'WGS84GEO',
      sort: 'index',
      endName: `${number}`,
      startX: curLng,
      startY: curLat,
      endX: destLng,
      endY: destLat,
      startName: `${destName}`,
    })
  };

  fetch(url, options)
    .then(res => res.json())
    .then((json) => {
      const {
        properties: {
          totalDistance: distance,
          totalTime: time,
        }
      } = json.features[0];
      info["distance"] = `${distance}m`;
      info["time"] = `${Math.round(time / 60)}분`;
      const jsonInfo = JSON.stringify(info);
      return res.send(jsonInfo);


      // return res.send(`${distance}m,${Math.round(time/60)}분`);
    })
    .catch(err => console.error('error:' + err));
});



app.post('/getInfoBuilding', async (req, res) => {
  const { curLat, curLng } = req.body;
  let { num } =req.body;

  //안드로이드는 애뮬레이터 상 기본 default 위치(curLat, curLng)가 미국으로 되어있음 => 직접 휴대폰에서 실시해야 정확한 값 도출함
  // console.log(curLat, curLng, num); 
  let destLat = "";
  let destLng = "";
  num = num.replace(" ","");

  console.log(`getInfoBuilding 도착: ${num}`)
  const query = [num, "%" + num +"%"];

  try {
    const selectQuery = db.query('SELECT * FROM building WHERE building_num = ? OR building_name LIKE ?; ', query, 
      (err, result, filed) => {
        if (result == 0) {
          return res.send(
            `<script>
              alert('근처 편의점 정보가 존재하지 않습니다.');
              location.href="/";
            </script>`
          );
        }
        if (err) {
          console.log(err);
        }
        result.map((found) => {
          destLat = found.building_lat;
          destLng = found.building_lag;
          console.log(`안임 ${destLng}`);
        })

        console.log(`밖임 ${destLng}`);
        const info = {};
        const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1';
        const options = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            appKey: 'l7xxfdc75c1509a74ecdba02bf5e024ee9d5'
          },
          body: JSON.stringify({
            angle: 0,
            speed: 0,
            reqCoordType: 'WGS84GEO',
            searchOption: '0',
            resCoordType: 'WGS84GEO',
            sort: 'index',
            startX: curLng,
            startY: curLat,
            endX: destLng,
            endY: destLat,
            startName: 'ss',
            endName: `${num}`,
          })
        };
        
        fetch(url, options)
          .then(res => res.json())
          .then((json) => {
            console.log(`제이슨: ${json}`);
            const {
              properties: {
                totalDistance: distance,
                totalTime: time,
              }
            } = json.features[0];

            console.log(distance, time);
            info["distance"] = `${distance}m`;
            info["time"] = `${Math.round(time / 60)}분`;
            const jsonInfo = JSON.stringify(info);

            return res.send(jsonInfo);
            // return res.send(`${distance}m,${Math.round(time/60)}분`);
          })
          .catch(err => console.error('error:' + err));
      });
  } catch {
    (err) => {
      return console.log(err);
    };
  }
})
