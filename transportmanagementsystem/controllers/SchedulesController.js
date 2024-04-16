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
            return res.render("schedules", {admin: false, userId: req.session.userId, userRole: req.session.userRole, userName: req.session.userName});
        }
    }

    async PostReport(req, res){
        if(req.body === null){
            return res.status(400).json({success: false, msg:"Không có id nào để thực hiện"});
        }else{
            console.log(req.body.report)
            try{
                const updateStatus = await Schedule.findOneAndUpdate({_id: req.body.id}, 
                    {
                        status: 2,
                        report: req.body.report
                    },
                    { new: true }
                )
    
                if(updateStatus){
                    return res.status(200).json({success: true, msg:"Đã cập nhật lịch trình", status: 1});
                }else{
                    return res.json({success: false, msg:"Chưa thực hiện được"});
                }
            }catch(err){
                return res.status(500).json({
                    success: false,
                    msg: "Đã xảy ra lỗi khi cập nhật thông tin lịch trình",
                    error: err.message,
                  });
            }
        }
    }

    async GetScheduleData(req, res){
        if(!req.session.userId){
            return res.render("index/login");
        }else{
            if(req.session.userRole === 2){
                var result = [];
                var employeeId = new ObjectId(req.session.userId);
                await Schedule.find().then((schedules) => {
                    for(var i = 0; i < schedules.length; i++){
                        if(schedules[i].employeeId.equals(employeeId)){
                            result.push(schedules[i])
                        }
                    }
                    return res.status(200).json({success: true, schedules: result, driver: true});
                }).catch((err) => {
                    return res.status(500).json({
                    success: false,
                    message: "Error",
                    });
                });
            }else{
                console.log("do ne");
                var result = [];
                await Schedule.find().then((schedules) => {
                    for(var i = 0; i < schedules.length; i++){
                        console.log(schedules[i]);
                        result.push(schedules[i])
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
    }

    async AddSchedule(req, res){
        if(req.body == null){
            return res.status(400).json({success: false, msg: "Không có thông tin để thực hiện"});
        }else{
            await Schedule.findOne({employeeId: req.body.employeeId, routeId: req.body.routeId}).then((schedule) => {
                if(schedule !== null){
                    return res.status(500).json({success: false, msg: "Đã đăng ký tuyến đường này"});
                }else{
                    try{
                        const newSchedule = new Schedule(req.body)
                        newSchedule.save()
                        return res.json({success: true, msg:"Thêm thành công"});
                    }catch(err){
                        throw err;
                    }
                }
            })
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

    async UpdateStatusSchedule(req, res){
        if(req.body === null){
            return res.status(400).json({success: false, msg:"Không có id nào để thực hiện"});
        }else{
            try{
                const updateStatus = await Schedule.findOneAndUpdate({_id: req.body.id}, 
                    {
                        status: 1
                    },
                    { new: true }
                )
    
                if(updateStatus){
                    return res.status(200).json({success: true, msg:"Đã cập nhật lịch trình", status: 1});
                }else{
                    return res.json({success: false, msg:"Chưa thực hiện được"});
                }
            }catch(err){
                return res.status(500).json({
                    success: false,
                    msg: "Đã xảy ra lỗi khi cập nhật thông tin lịch trình",
                    error: err.message,
                  });
            }
        }
    }

    async GetScheduleById(req, res){
        if(req.params.id === null){
            return res.json({success: false, msg: "Id không hợp lệ"});
        }else{
            Schedule.findById(req.params.id).then(s => {
                if(s != null){
                    return res.json({success: true, data: s});
                }else{
                    return res.json({success: false, msg: "Không tìm thấy trong dữ liệu"});
                }
            })
        }
    }
}

module.exports = new SchedulesController();