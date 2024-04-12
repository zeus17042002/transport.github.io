var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcrypt");
var { body, validationResult } = require("express-validator");
var UserController = require("../controllers/UserController");


/* GET users listing. */
//Profile
router.use("", function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    return res.redirect("/login");
  }
});
router.get("/change-password", (req, res) => {
  res.render("users/change-password");
});

router.get("/", (req, res) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        let ownProfile = 0;
        if (user._id == req.session.userId) {
          ownProfile = 1;
        }
        return res.render("users/profile", {
          user: user._doc,
          isMy: ownProfile,
          userId: req.session.userId,
        });
      }
    })
    .catch();
});

router.post("/change-password", UserController.PostChangePassword);
router.post("/upload", UserController.PostUpdateImage);
router.put("/updateProfile", UserController.PutUpdateEmployee);

module.exports = router;
