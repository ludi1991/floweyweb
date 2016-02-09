var express = require('express');
var router = express.Router();
var db = require('../db');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post('/',function(req,res,next){
  console.log(req.body);
  db.query("SELECT * from user where username = '" + req.body.username + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "用户名不存在！";
        res.send(JSON.stringify(result));
      }
      else if ( req.body.password == rows[0].password ){
        req.session.username = rows[0].username;
        req.session.pri_1 = rows[0].pri_1;  // super admin
        req.session.pri_2 = rows[0].pri_2;
        req.session.pri_3 = rows[0].pri_3;
        req.session.pri_4 = rows[0].pri_4;
        req.session.pri_5 = rows[0].pri_5;
        req.session.pri_6 = rows[0].pri_6;
        req.session.pri_7 = rows[0].pri_7;
        req.session.pri_8 = rows[0].pri_8;
        req.session.pri_9 = rows[0].pri_9;
        req.session.pri_10 = rows[0].pri_10;
        req.session.pri_11 = rows[0].pri_11;
        req.session.pri_12 = rows[0].pri_12;
        req.session.userid = rows[0].id;
        req.session.allowed = 1;
        // res.send("yep");
        res.redirect("/users");
      }
      else {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "密码错误！";
        res.send(JSON.stringify(result));
      };

  });
});


router.get('/logout',function(req,res,next){
    if (req.session.allowed = 1) {
        req.session.allowed = undefined;
        req.session.privilege = undefined;
        req.session.username = undefined;
        req.session.userid = undefined;
        req.session.pri_1 = undefined;
        req.session.pri_2 = undefined;
        req.session.pri_3 = undefined;
        req.session.pri_4 = undefined;
        req.session.pri_5 = undefined;
        req.session.pri_6 = undefined;
        req.session.pri_7 = undefined;
        req.session.pri_8 = undefined;
        req.session.pri_9 = undefined;
        req.session.pri_10 = undefined;
        req.session.pri_11 = undefined;
        req.session.pri_12 = undefined;
    }
    res.redirect("/login");
})



module.exports = router;
