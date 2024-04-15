var express = require("express");
var router = express.Router();
var ReportController = require("../controllers/ReportController");


router.get("/", ReportController.GetReport);


module.exports = router;