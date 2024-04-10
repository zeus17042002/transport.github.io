var express = require("express");
var router = express.Router();
var RoutesController = require("../controllers/RoutesController");


router.get("/", RoutesController.GetRoutes);
router.post("/add", RoutesController.AddRoute);
router.post("/edit/:id", RoutesController.EditRoute);
router.get("/delete/:id", RoutesController.DeleteRoute);

module.exports = router;