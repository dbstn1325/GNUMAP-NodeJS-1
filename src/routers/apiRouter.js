const express = require("express");
const apiRouter = express.Router();

apiRouter.post("/", (req, res) => {
  console.log(req.body);
  let pos = req.body;
  let lat = pos.lat;
  let lng = pos.lng;
  let num = pos.num;
  return res.render("pathInfo.html", { lat: lat, lng: lng, num: num });
});

module.exports = apiRouter;
