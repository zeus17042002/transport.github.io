var User = require("../models/User");
var Bus = require("../models/Bus");
var Route = require("../models/Route");
var Schedule = require("../models/Schedule");
var { body, validationResult } = require("express-validator");
const assert = require('assert');
const session = require("express-session");

class RoutesController{
    async GetReport(req, res){
        if(!req.session.userId){
            return res.render("index/login");
        }else{
            if(req.session.userRole === 0 || req.session.userRole === 1){
                return res.render("admin-report", {userRole: req.session.userRole,userId: req.session.userId, userName: req.session.userName, admin: true});
            }else{
                return res.redirect("/")
            }
        }
    }

    async ExportReport(req, res){
        if(!req.session.userId){
            return res.render("index/login");
        }else if(req.params.id === null){
            return res.status(404);
        }else{
            await Schedule.findById(req.params.id).then(s => {
                return res.render("export-report", {scheduleId: s._id, employeeId: s.employeeId, routeId: s.routeId, busId: s.busId ,userRole: req.session.userRole,userId: req.session.userId, userName: req.session.userName, admin: true});
            })
        }
    }

    async EditRoute(req, res){
        try{
            const updateRoute = await Route.findOneAndUpdate({_id: req.params.id  },
                {
                  routeName: req.body.routeName,
                  start: req.body.start,
                  end: req.body.end,
                  distance: req.body.distance,
                  fare: req.body.fare,
                  status: req.body.status
                },
                { new: true }
            )

            if(updateRoute){
                return res.redirect("/routes");
            }else{
                return res.status(500);
            }
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật thông tin tuyến đường",
                error: error.message,
              });
        }
    }

    async DeleteRoute(req, res){
        try{
            const deleteRoute = await Route.findByIdAndDelete(req.params.id)
            if(deleteRoute){
                res.redirect("/routes");
            }else{
                res.status(500);
            }
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa thông tin tuyến đường",
                error: error.message,
              });
        }
    }

    async GetRouteById(req, res){
        if(req.params.id === null || req.params.id === ""){
            return res.json({success: false, msg:"Id không hợp lệ"});
        }else{
            await Route.findById(req.params.id).then((r) => {
                if(!r){
                    return res.status(400).json({
                        success: false,
                        msg: "Không tìm thấy route tương ứng"
                    })
                }else{
                    return res.status(200).json({success: true, route: r})
                }
            }).catch((err) => {
                return res.status(500).json({
                    success: false,
                    message: "Error",
                  });
            })
        }
    }
}

module.exports = new RoutesController();