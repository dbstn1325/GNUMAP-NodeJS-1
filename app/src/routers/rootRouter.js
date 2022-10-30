const express = require("express");

const rootRouter = express.Router();

rootRouter.get('/', ()=> { console.log("hi")});

module.exports = rootRouter;