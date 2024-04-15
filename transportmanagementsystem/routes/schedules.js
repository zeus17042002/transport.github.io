var express = require("express");
var router = express.Router();
var SchedulesController = require("../controllers/SchedulesController");

router.get("/", SchedulesController.GetSchedule);
router.get('/getData', SchedulesController.GetScheduleData);
router.post('/report', SchedulesController.PostReport);
router.post('/add', SchedulesController.AddSchedule);
router.post('/delete', SchedulesController.DeleteSchedule);
router.post('/updateStatus', SchedulesController.UpdateStatusSchedule);

module.exports = router;