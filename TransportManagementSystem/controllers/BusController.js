const { query } = require("express");
const Bus = require("../models/Bus.js");
var { body, validationResult } = require("express-validator");

class BusController {
  async GetBuses(req, res) {
    Bus.find()
      .then((buses) => {
        if (!buses) {
          return res.status(404).json({
            success: false,
            message: "Can found any bus in database",
          });
        }
        let result = [];
        buses.forEach((buses) => {
          result.push(buses._doc);
        });
        return res.render("admin/bus-management", {
          buses: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      });
  }
  async GetBusesData(req, res) {
    Bus.find()
      .then((buses) => {
        if (!buses) {
          return res.status(404).json({
            success: false,
            message: "Can found any bus in database",
          });
        }
        let result = [];
        buses.forEach((buses) => {
          result.push(buses._doc);
        });
        return res.status(200).json({
          success: true,
          buses: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      });
  }
  async GetBusById(req, res) {
    console.log(req.params.id);
    Bus.findById(req.params.id)
      .then((bus) => {
        if (!bus) {
          return res.status(404).json({
            success: false,
            message: "Can found any bus in database",
          });
        }
        return res.status(200).json({
          success: true,
          bus: bus,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      });
  }
  async AddBus(req, res) {
    await body("licensePlate")
      .notEmpty()
      .withMessage("Vui lòng nhập biển số xe")
      .custom(async (value) => {
        const existingBus = await Bus.findOne({ licensePlate: value });
        if (existingBus) {
          throw new Error("Xe đã có trong hệ thống");
        }
        return true;
      })
      .run(req);
    await body("model")
      .notEmpty()
      .withMessage("Vui lòng chọn loại xe")
      .trim()
      .escape()
      .run(req);
    await body("capacity")
      .notEmpty()
      .withMessage("Nhập số chỗ")
      .trim()
      .escape()
      .run(req);

    const errors = validationResult(req);
    let { licensePlateErr, modelErr, capacityErr } = "";
    if (!errors.isEmpty()) {
      console.log(errors);
      errors.array().forEach((err) => {
        switch (err.path) {
          case "licensePlate":
            licensePlateErr = err.msg;
            break;
          case "model":
            modelErr = err.msg;
            break;
          case "capacity":
            capacityErr = err.msg;
        }
      });
      return res.status(400).json({
        success: false,
        message: "Lỗi Thông Số",
        body: req.body,
        modelErr: modelErr,
        licensePlateErr: licensePlateErr,
        capacityErr: capacityErr,
      });
    }
    try {
      const newBus = new Bus({
        licensePlate: req.body.licensePlate,
        _model: req.body.model,
        capacity: req.body.capacity,
      });

      await newBus.save();
      return res
        .status(200)
        .json({ success: true, message: "Thêm thành công" });
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  }
  async DeleteBus(req, res) {
    Bus.findByIdAndDelete(req.params.id)
      .then((bus) => {
        return res.status(200).json({
          success: true,
          message: "Xóa thành công",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });
  }
  async UpdateBus(req, res) {
    await body("licensePlate")
      .notEmpty()
      .withMessage("Vui lòng nhập biển số xe")
      .trim()
      .escape()
      .run(req);
    await body("model")
      .notEmpty()
      .withMessage("Vui lòng chọn loại xe")
      .trim()
      .escape()
      .run(req);
    await body("capacity")
      .notEmpty()
      .withMessage("Nhập số chỗ")
      .trim()
      .escape()
      .run(req);

    const errors = validationResult(req);
    let { licensePlateErr, modelErr, capacityErr } = "";
    if (!errors.isEmpty()) {
      errors.array().forEach((err) => {
        switch (err.path) {
          case "licensePlate":
            licensePlateErr = err.msg;
            break;
          case "model":
            modelErr = err.msg;
            break;
          case "capacity":
            capacityErr = err.msg;
        }
      });
      return res.status(400).json({
        success: false,
        body: req.body,
        modelErr: modelErr,
        licensePlateErr: licensePlateErr,
        capacityErr: capacityErr,
      });
    }
    try {
      const existingBus = await Bus.findOne({
        licensePlate: req.body.licensePlate,
      });
      if (existingBus && existingBus._doc._id != req.params.id) {
        return res.status(400).json({
          success: false,
          data: req.body,
          message: "Đã có xe mang biển số này trong hệ thống",
        });
      }

      // Cập nhật thông tin của xe nếu tìm thấy
      const updatedBus = await Bus.findOneAndUpdate(
        { _id: req.params.id },
        {
          licensePlate: req.body.licensePlate,
          _model: req.body.model,
          capacity: req.body.capacity,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedBus,
        message: "Thông tin xe đã được cập nhật thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật thông tin xe",
        error: error.message,
      });
    }
  }
  async UpdateBusDriver(req, res) {
    Bus.findByIdAndUpdate(req.body.id, {
      employeeId: req.body.employeeId,
    })
      .then((bus) => {
        if (!bus) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Thêm/Thay đổi tài xế thành công",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });
  }
}

module.exports = new BusController();
