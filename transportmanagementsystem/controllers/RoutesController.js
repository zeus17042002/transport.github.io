var User = require("../models/User");
var Bus = require("../models/Bus");
var Route = require("../models/Route");
var Schedule = require("../models/Schedule");
var { body, validationResult } = require("express-validator");
const assert = require('assert')

class RoutesController{
    async GetRoutes(req, res){
        // if(!req.session.userId){
        //     return res.render("index/login");
        // }else{
            var routes = Route.find().
            then((routes) => {
                var result = [];
                routes.forEach((route) => {
                    result.push(route._doc);
                })
                console.log(result);
                return res.render("routes", {routes: result});
            }).catch(err => {
                return res.status(500).json({
                    success: false,
                    message: "Error",
                  });
            });
        //}
    }

    async AddRoute(req, res){
        console.log(req.body);
        if(req.body === null){
            return res.status(400);
        }else{
            try{
                const newRoute = new Route(req.body)
                newRoute.save()
                return res.redirect("/routes/");
            }catch (err){
                console.log(err);
                return res.status(500);
            }
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
                  fare: req.body.fare
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
}

module.exports = new RoutesController();