const express = require("express");
const morgan = require("morgan");
const logger = morgan("dev");
const { render, name } = require("ejs");
const mysql = require("mysql2");
const app = express();
const fetch = require("node-fetch");
const http = require("http");
const { type } = require("os");
const sort = require("sortjson");
const { errorMonitor } = require("events");
const { createBrotliDecompress } = require("zlib");
const flash = require("connect-flash");

const rootRouter = require("./src/routers/rootRouter");

// view 경로 설정
app.set("views", __dirname + "/src/views");
// 화면 engine을 ejs로 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// app.use(flash);
app.use(express.json());
app.use(express.urlencoded());
// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + "/public"));
// 전송 로그를 기록
app.use(morgan("dev"));

// 데이터 베이스 설정, host 명은 mysql이 구동중인 컨테이너명을 입력한다.
const db = mysql.createConnection({
  host: "203.255.3.66",
  port: "13306",
  user: "root",
  password: "1234",
  database: "gnumap",
});

// 데이터 베이스 연결
db.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db connected");
});

app.use("/", rootRouter);

//라우터 설정
app.get("/gnumap", (req, res) => {
  return res.render("gnumap.html");
});

// 데이터 베이스에서 건물에 대한 정보를 가져와, pathInfo로 rendering 한다.
app.post("/find", (req, res) => {
  let { lat, lng } = req.body;
  let { num } = req.body;
  //공백 제거
  num = num.replace(/(\s*)/g, "");
  num = num.replace("동", "");

  const params = [num, "%" + num + "%"];

  let query = ``;
  if (num == parseInt(num)) {
    query = `SELECT * FROM building WHERE num = ${num}`;
  } else {
    query = `SELECT * FROM building WHERE name LIKE "%${num}%"`;
  }

  try {
    const selectQuery = db.query(query, (err, result, filed) => {
      if (result == 0) {
        return res.send("error");
      }
      if (err) {
        return res.send("error");
      }
      return result.map((found) => {
        // console.log(found);
        res.render("pathInfo.html", {
          lat: lat,
          lng: lng,
          tlat: found.lat,
          tlng: found.lng,
        });
      });
    });
  } catch {
    (err) => {
      return res.send("error");
    };
  }
});

// 길찾기 api를 호출함
app.post("/getInfoBuilding", async (req, res) => {
  let { curLat, curLng } = req.body;

  let { num } = req.body;
  num = num.replace("동", "");

  let destInfo = [];
  let destLat = "";
  let destLng = "";
  //안드로이드는 애뮬레이터 상 기본 default 위치(curLat, curLng)가 미국으로 되어있음 => 직접 휴대폰에서 실시해야 정확한 값 도출함
  // console.log(curLat, curLng, num);

  //공백 제거
  num = num.replace(/(\s*)/g, "");
  console.log(typeof num);
  let query = ``;
  if (num == parseInt(num)) {
    query = `SELECT * FROM building WHERE num = ${num}`;
  } else {
    query = `SELECT * FROM building WHERE name LIKE "%${num}%"`;
  }

  if (num.length > 10) {
    return res.send(
      `<script>
        alert('근처 편의점 정보가 존재하지 않습니다.');
        location.href="/";
      </script>`
    );
  }

  function getData() {
    return new Promise(function (resolve, reject) {
      const selectQuery = db.query(query, (err, result, filed) => {
        console.log(result);
        if (result == 0) {
          return res.send(
            `<script>
              alert('근처 편의점 정보가 존재하지 않습니다.');
              location.href="/";
            </script>`
          );
        }
        if (err) {
          return console.log(err);
        }
        result.map((found) => {
          destLat = found.lat;
          destLng = found.lng;
          console.log(`출발지안: ${curLat}, ${curLng}`);
          console.log(`목적지안: ${destLat}, ${destLng}`);
        });
        destInfo["destLat"] = destLat;
        destInfo["destLng"] = destLng;
        resolve(destInfo);
      });
    });
  }

  getData().then(function (resolvedData) {
    console.log(`출발지안: ${curLat}, ${curLng}`);
    console.log(`목적지안: ${destLat}, ${destLng}`);
    const info = {};
    const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1";

    //

    // const options2 = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     appKey: "l7xx1317e6cad24d4f0d8048aa7336e5623b",
    //   },
    //   body: JSON.stringify({
    //     startX: 126.92365493654832,
    //     startY: 37.556770374096615,
    //     angle: 20,
    //     speed: 30,
    //     endPoiId: "10001",
    //     endX: 126.92432158129688,
    //     endY: 37.55279861528311,
    //     passList: "126.92774822,37.55395475_126.92577620,37.55337145",
    //     reqCoordType: "WGS84GEO",
    //     startName: "%EC%B6%9C%EB%B0%9C",
    //     endName: "%EB%8F%84%EC%B0%A9",
    //     searchOption: "0",
    //     resCoordType: "WGS84GEO",
    //     sort: "index",
    //   }),
    // };

    // fetch(
    //   "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function",
    //   options
    // )
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));

    //

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appKey: "l7xx680a31160f3a4213ad53358d54e688f5",
      },
      body: JSON.stringify({
        angle: 0,
        speed: 0,
        reqCoordType: "WGS84GEO",
        searchOption: "0",
        resCoordType: "WGS84GEO",
        sort: "index",
        startX: curLng,
        startY: curLat,
        endX: resolvedData["destLng"],
        endY: resolvedData["destLat"],
        startName: "ss",
        endName: `${num}`,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(`제이슨: ${json.features[0]}`);

        // console.log(res);
        const {
          properties: { totalDistance: distance, totalTime: time },
        } = json.features[0];

        if (distance > 30000) {
          return res.send(JSON.stringify({ distance: null, time: null }));
        }

        console.log(distance, time);
        info["distance"] = `${distance}m`;
        info["time"] = `${Math.round(time / 60)}분`;
        const jsonInfo = JSON.stringify(info);

        return res.send(jsonInfo);
        // return res.send(`${distance}m,${Math.round(time/60)}분`);
      })
      .catch((err) => {
        console.log("에러 ㅅㄱ");
        return res.send(JSON.stringify({ distance: null, time: null }));
      });
  });
});

// 데이터를 가져와 정보 수정 요청 테이블에 넣는다.
app.post("/getreviseInfo", async (req, res) => {
  const { num, uilding_name, request_location, request_revise } = req.body;
  console.log(num, uilding_name);
  try {
    // const selectQuery = db.query('CREATE TABLE request (request_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, num INT NOT NULL, request_buliding_name VARCHAR(128) NOT NULL, request_location TEXT NOT NULL, request_revise TEXT NOT NULL, FOREIGN KEY(num) REFERENCES building(num))',
    const selectQuery = db.query(
      `INSERT INTO request VALUES(NULL, '${uilding_name}', '${request_location}', '${request_revise}', '${num}')`,
      (err, result, filed) => {
        if (result == 0) {
          return res.send("error");
        }
        if (
          uilding_name.length == 0 ||
          num.length == 0 ||
          request_location.length == 0 ||
          request_revise.length == 0
        ) {
          return res.send("error");
        }
        if (err) {
          return res.send("error");
        }
        console.log(result);
      }
    );
  } catch {
    (err) => {
      return res.send("error");
    };
  }
  res.send("recieved");
});

// 편의시설 정보를 가져옴
app.post("/getInfoConvenient", async (req, res) => {
  let { curLat, curLng, category } = req.body;

  console.log(`hi${curLat}`, curLng);
  let convenient_info = [];
  let convenient_length = 0;

  function getData() {
    return new Promise(function (resolve, reject) {
      const selectQuery = db.query(
        `SELECT * FROM convenient WHERE category = ${category} `,
        async (err, result, filed) => {
          if (result == 0) {
            return res.send("error");
          }
          if (err) {
            return res.send("error");
          }
          convenient_length = result.length;

          // DB 정보 저장 (JSON 형식)
          for (let i = 0; i < convenient_length; i++) {
            convenient_info[i] = {
              name: result[i].convenient_name,
              image: result[i].convenient_image,
              phone: result[i].convenient_phone,
              lat: result[i].convenient_lat,
              lng: result[i].convenient_lng,
              operating_time: result[i].operating_time,
            };
          }
          resolve(convenient_info);

          reject(new Error("Request is failed"));
        }
      );
    }).catch((err) => {
      return res.send(JSON.stringify({ convenient_info: null }));
    });
  }

  getData()
    .then(function (resolvedData) {
      return res.send(resolvedData);
    })
    .catch(function (err) {
      return res.send(JSON.stringify({ convenient_info: null }));
    });
});

//
app.post("/pathConvenient", async (req, res) => {
  let { curLat, curLng } = req.body;
  const { destLat, destLng } = req.body;
  console.log(curLat, curLng, destLat, destLng);

  try {
    const pathInfo = {};
    const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appKey: "l7xxed2c734830ae4364975ef11e67a76e81",
      },
      body: JSON.stringify({
        angle: 0,
        speed: 0,
        reqCoordType: "WGS84GEO",
        searchOption: "0",
        resCoordType: "WGS84GEO",
        sort: "index",
        startX: curLng,
        startY: curLat,
        endX: destLng,
        endY: destLat,
        startName: "ss",
        endName: `aa`,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(`제이슨: ${json}`);

        const {
          properties: { totalDistance: distance, totalTime: time },
        } = json.features[0];

        console.log(distance, time);
        pathInfo["distance"] = `${distance}m`;
        pathInfo["time"] = `${Math.round(time / 60)}분`;
        const jsonInfo = JSON.stringify(pathInfo);

        return res.send(jsonInfo);
        // return res.send(`${distance}m,${Math.round(time/60)}분`);
      })
      .catch((err) => {
        return res.send(JSON.stringify({ distance: null, time: null }));
      });
  } catch {
    (err) => {
      console.log(err);
      return JSON.stringify({ distance: null, time: null });
    };
  }
});

// 편의 시설에 대한 정보를 가져와, pathInfo로 rendering 한다.
app.post("/findConvenient", (req, res) => {
  let { curLat, curLng } = req.body;
  const { destLat, destLng } = req.body; //현재 위치, 현재 경도
  console.log(`find 2도착: ${curLat} ${curLng} ${destLat} ${destLng}`);

  return res.render("pathInfo.html", {
    lat: curLat,
    lng: curLng,
    tlat: destLat,
    tlng: destLng,
  });
});

//
app.post("/getfavitems", (req, res) => {
  let { num } = req.body;

  //공백 제거
  num = num.replace(/(\s*)/g, "");
  num = num.replace("동", "");
  console.log(num);

  const params = [num, "%" + num + "%"];

  let query = ``;
  if (num == parseInt(num)) {
    console.log("int임");
    query = `SELECT * FROM building WHERE num = ${num}`;
  } else {
    query = `SELECT * FROM building WHERE name LIKE "%${num}%"`;
  }
  try {
    const selectQuery = db.query(query, params, (err, result, filed) => {
      if (result == 0) {
        return res.send(JSON.stringify({ num: null, name: null }));
      }
      if (err) {
        return res.send(JSON.stringify({ num: null, name: null }));
        console.log(err);
      }
      return result.map((found) => {
        // console.log(found);
        return res.send(JSON.stringify({ num: found.num, name: found.name }));
      });
    });
  } catch {
    (err) => {
      return res.send(JSON.stringify({ num: null, name: null }));
    };
  }
});

module.exports = app;
