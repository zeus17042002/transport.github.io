var express = require("express");
var router = express.Router();
var ReportController = require("../controllers/ReportController");


router.get("/", ReportController.GetReport);
router.get("/export/:id", ReportController.ExportReport);

module.exports = router;