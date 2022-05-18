const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/:lat/:lng", (req, res) => {
  let { lat, lng } = req.params;
  console.log('lat',lat,'lng',lng);
  return res.render("pathInfo.html", { lat: lat, lng: lng});
});

module.exports = apiRouter;
