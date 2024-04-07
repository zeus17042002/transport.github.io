var express = require("express");
var router = express.Router();
var IndexController = require("../controllers/IndexController");
const BusController = require("../controllers/BusController");

router.get("/", function (req, res, next) {
  if(req.session.userId){
    return res.render("index/index", {
      title: "TdtuSales",
      userId: req.session.userId,
      userName: req.session.userName,
    });
  }else{
    return res.redirect("/login")
  }
});

// Middleware để kiểm tra trạng thái phiên, không áp dụng cho "/logout"
router.use(/^(?!\/logout$)/, (req, res, next) => {
  if (req.session && req.session.userId) {
    if (req.session.userStatus == 0) {
      return res.render("lock");
    } else {
      next();
    }
  } else {
    // Handle scenarios where session userId is not set
    next();
  }
});

// Các tuyến đường khác

router.get("/login", IndexController.GetLogin);
router.post("/login", IndexController.PostLogin);
router.post("/addEmployee", IndexController.PostAddEmployee);
router.get("/logout", IndexController.GetLogout);
router.get("/routes", IndexController.GetRoutes);
router.get("/employees", IndexController.GetEmployees);
router.post("/changePw", IndexController.PostChangePassword);
router.post("/resendAccessLink", IndexController.ResendAccessLink);

//Bus route
router.get("/bus", BusController.GetBuses);
router.post("/bus/getBuses", BusController.GetBusesData);
router.post("/bus/getBus/:id", BusController.GetBusById);
router.put("/bus/update/:id", BusController.UpdateBus);
router.post("/bus/add", BusController.AddBus);
router.delete("/bus/delete/:id", BusController.DeleteBus);
module.exports = router;
