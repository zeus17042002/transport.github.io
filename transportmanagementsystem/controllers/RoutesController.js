var User = require("../models/User");
var Bus = require("../models/Bus");
var Route = require("../models/Route");
var Schedule = require("../models/Schedule");
var { body, validationResult } = require("express-validator");
const assert = require('assert');
const session = require("express-session");

class RoutesController{
    async GetRoutes(req, res){
      console.log(req.session.userRole);
        if(!req.session.userId){
            return res.render("index/login");
        }else{
                var routes = Route.find().
            then((routes) => {
                var result = [];
                routes.forEach((route) => {
                    result.push(route._doc);
                })
                if(req.session.userRole === 0 || req.session.userRole === 1){
                    return res.render("routes", {routes: result, userRole: req.session.userRole,userId: req.session.userId, userName: req.session.userName, admin: true});
                }else{
                    return res.render("routes", {routes: result, userRole: req.session.userRole, userId: req.session.userId, userName: req.session.userName});
                }
            }).catch(err => {
                return res.status(500).json({
                    success: false, 
                    message: "Error",
                  });
            });
        }
    }

    async AddRoute(req, res){
        if(req.body === null){
            return res.json({success: false, msg: "Vui lòng điền thông tin vào"});
        }else if(req.body.routeName === "" || req.body.start === "" || req.body.end === "" || req.body.distance === "" || req.body.fare === ""){
            return res.json({success: false, msg: "Vui lòng điền đầy đủ thông tin"});
        }else
        {
            await Route.find({routeName: req.body.routeName}).then((route) => {
                if(route.length !== 0){
                    return res.json({success: false, msg: "Đã tồn tại tên tuyến đường này"});
                }else{
                    try{
                        const newRoute = new Route(req.body)
                        newRoute.save()
                        return res.json({success: true, data: newRoute, msg:"Đã thêm thành công"});
                    }catch (err){
                        console.log(err);
                        return res.status(500);
                    }
                }
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