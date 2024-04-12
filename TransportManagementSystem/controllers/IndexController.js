var User = require("../models/User");
var Bus = require("../models/Bus");
var Customer = require("../models/Customer");
var Park = require("../models/Park");
var Route = require("../models/Route");
var Schedule = require("../models/Schedule");
var bcrypt = require("bcrypt");
var { body, validationResult } = require("express-validator");
const crypto = require("crypto");
var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");

class IndexController {
  //Management part
  async GetRoutes(req, res) {
    if (!req.session.userId) {
      return res.render("index/login");
    } else {
      return res.render("admin/route-management");
    }
  }

  async GetEmployees(req, res) {
    if (!req.session.userId) {
      return res.redirect("/login");
    } else {
      User.find({ role: { $in: [1, 2] } })
        .then((users) => {
          let result = [];
          users.forEach((user) => {
            result.push(user._doc);
          });
          return res.render("admin/employee-management", {
            success: true,
            Users: result,
            userId: req.session.userId,
            userName: req.session.userName,
            userRole: req.session.userRole,
          });
        })
        .catch((err) => {
          return res.render("admin/employee-management", {
            success: false,
            msg: err,
          });
        });
    }
  }

  //end Management part

  //Login Part
  async GetLogin(req, res) {
    if (!req.session.userId) {
      return res.render("index/login");
    } else {
      return res.redirect("/");
    }
  }
  async PostLogin(req, res) {
    // Validation rules using express-validator
    await body("username")
      .notEmpty()
      .withMessage("Vui lòng nhập tên đăng nhập")
      .trim()
      .escape()
      .run(req);
    await body("password")
      .notEmpty()
      .withMessage("Vui lòng nhập mật khẩu")
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index/login", {
        body: req.body,
        Err: errors.array()[0].msg,
      });
    }

    let condition = {
      username: req.body.username,
    };

    try {
      const users = await User.find(condition);
      if (users.length != 0) {
        const user = users[0]._doc;
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          user.pass
        );

        if (!passwordMatch) {
          return res.render("index/login", {
            body: req.body,
            Err: "Sai mật khẩu",
          });
        }

        req.session.userId = user._id;
        req.session.userRole = user.role;
        req.session.userName = user.name;
        req.session.userStatus = user.status;
        return res.redirect("/");
      } else {
        console.log("Tài khoản không tồn tại");
        return res.render("index/login", {
          body: req.body,
          Err: "Tài khoản không tồn tại",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async PostChangePassword(req, res) {
    if (!req.body.password) {
      return res.render("index/firstlogin", {
        passwordErr: "Không được bỏ trống mật khẩu",
      });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing new password" });
      }
      User.findOneAndUpdate(
        {
          email: req.session.userEmail,
        },
        { pass: hashedPassword, isChange: 1 }
      )
        .then((message) => {
          let user = message._doc;
          console.log(message._doc.email);
          req.session.userId = user._id;
          req.session.userStatus = user.status;
          res.redirect("/");
        })
        .catch((error) => {
          res.status(400).json({ message: error });
        });
    });
  }
  async PostAddEmployee(req, res) {
    // Validation rules using express-validator
    await body("email")
      .notEmpty()
      .withMessage("Vui lòng nhập email")
      .isEmail()
      .withMessage("Địa chỉ email không hợp lệ")
      .normalizeEmail()
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("Tài khoản đã tồn tại");
        }
        return true;
      })
      .run(req);
    await body("name")
      .notEmpty()
      .withMessage("Vui lòng nhập tên")
      .trim()
      .escape()
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    let { nameErr, emailErr } = "";
    if (!errors.isEmpty()) {
      errors.array().forEach((err) => {
        switch (err.path) {
          case "name":
            nameErr = err.msg;
            break;
          case "email":
            emailErr = err.msg;
            break;
        }
      });
      return res.status(400).json({
        success: false,
        body: req.body,
        nameErr: nameErr,
        emailErr: emailErr,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(
        getUsernameFromEmail(req.body.email),
        10
      );
      console.log(req.body.email);
      const newUser = new User({
        name: req.body.name,
        username: getUsernameFromEmail(req.body.email),
        pass: hashedPassword,
        role: req.body.role,
        email: req.body.email,
        createdAt: new Date(),
        status: 1,
        avatarPath: "avatar.png",
        isChange: 0,
      });

      await newUser.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Registration failed" });
    }
  }
  //Logout Part
  async GetLogout(req, res) {
    // Kiểm tra xem phiên tồn tại trước khi xóa
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          // Xử lý lỗi khi xóa phiên
          return res.status(500).send("Lỗi khi đăng xuất");
        } else {
          // Chuyển hướng sau khi xóa thành công
          return res.redirect("/");
        }
      });
    } else {
      // Phiên không tồn tại, có thể đã bị xóa trước đó
      return res.redirect("/");
    }
  }
}

function getUsernameFromEmail(email) {
  // Split the email address at the "@" symbol
  const parts = email.split("@");

  // The first part (parts[0]) is the username
  const username = parts[0];

  return username;
}
//Generate key for resending login link
function generateSecretKey() {
  // Generate a random 32-byte (256-bit) secret key using a strong cryptographic algorithm
  return crypto.randomBytes(32).toString("hex");
}

module.exports = new IndexController();
