var User = require("../models/User");
var Route = require("../models/Route");
var Schedule = require("../models/Schedule");
var { body, validationResult } = require("express-validator");
const assert = require('assert');
const session = require("express-session");
var ObjectId = require('mongodb').ObjectId;

class SchedulesController{
    async GetSchedule(req, res){
        if(!req.session.userId){
            return res.render("index/login");
        }else{
            if(req.session.userRole === 0){
                return res.render("schedules",{admin: true});
            }else{
                return res.render("schedules", {admin: false, userId: req.session.userId});
            }
        }
    }

    async GetScheduleData(req, res){
        if(!req.session.userId){
            return res.render("index/login");
        }else{
            var result = [];
            var employeeId = new ObjectId(req.session.userId);
            await Schedule.find().then((schedules) => {
                for(var i = 0; i < schedules.length; i++){
                    if(schedules[i].employeeId.equals(employeeId)){
                        result.push(schedules[i])
                    }
                }
                return res.status(200).json({success: true, schedules: result});
            }).catch((err) => {
                return res.status(500).json({
                  success: false,
                  message: "Error",
                });
              });
        }
    }

    async AddSchedule(req, res){
        if(req.body == null){
            return res.status(400).json({success: false, msg: "Không có thông tin để thực hiện"});
        }else{
            try{
                const newSchedule = new Schedule(req.body)
                newSchedule.save()
                return res.json({success: true, msg:"Thêm thành công"});
            }catch(err){
                console.log(err);
                throw err;
            }
        }
    }

    async DeleteSchedule(req, res){
        if(req.body === null){
            return res.status(400).json({success: false, msg: "Chưa thực hiện việc xóa được"});
        }else{
            try{
                await Schedule.findByIdAndDelete(req.body._id).then(() => {
                    return res.status(200).json({success: true, msg: "Đã hủy lịch thành công"})
                })
            }catch(err){
                return res.status(500).json({
                    success: false,
                    message: "Đã xảy ra lỗi khi xóa thông tin lịch trình",
                    error: error.message,
                  });
            }
        }
    }
}

module.exports = new SchedulesController();