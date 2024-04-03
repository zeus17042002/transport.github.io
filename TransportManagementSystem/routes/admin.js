var express = require('express');
var router = express.Router();
var AdminController = require("../controllers/AdminController");
/* GET admin listing. */
router.use('/', (req,res, next)=>{
  if(req.session.userRole != 0){
    return res.render('admin/out-permission')
  }else{
    next();
  }
});
router.get('/', AdminController.GetAdmin);

router.get('/employees', AdminController.GetEmployee);
router.get('/changePass', AdminController.GetChangeAdminPassword);

router.get('/employees/:id', AdminController.GetOneEmployee)
router.put('/changeStatusEmployee', AdminController.PutStatusEmp);
router.post("/GetUserInfo", AdminController.PostGetUserInfo)
router.post("/AdminChangePassword", AdminController.PutChangeAdminPassword)
router.put("/updateEmployee", AdminController.PutUpdateEmployee)




module.exports = router;