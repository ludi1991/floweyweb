var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1){
        if (req.session.pri_1==1 || req.session.pri_2==1) {
            res.render('user_control', { title: 'user_control' , session : req.session });
        }
        else{
            res.redirect(helper.go_where_you_can(req));
        }
    }
    else{
        res.redirect("/login");
    }
});

//create user
router.post('/create',function(req,res,next){
    // console.log(req.body);
    if (req.session.allowed == 1 ) {
        if (req.session.pri_1==1 ) {
            db.query("SELECT username from user where username = '" + req.body.username + "'",function(error,rows,fields){
                if (error) throw error;
                if (rows[0] != undefined ) {
                    var result = new Object();
                    result.Result = "ERROR";
                    result.Message = "用户名已存在！";
                    res.send(JSON.stringify(result));
                }
                else {
                    var sql = helper.get_sql_str_insert("user",req);
                    db.query(sql,function(error,rows,fields){
                        if (error) throw error;
                        db.query("SELECT * from user where username = '" + req.body.username + "'",function (error,rows,fields){
                            if (error) throw error;
                            // console.log(row);
                            var result = new Object();
                            result.Result = "OK";
                            result.Record = rows[0];
                            res.send(JSON.stringify(result));
                        });
                    });
                }
            });
        }
        else
        {
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "权限不足！";
            res.send(JSON.stringify(result));
        }
    }
    else
    {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

router.post("/update",function(req,res,next){
    if (req.session.allowed == 1 ) {
        if (req.session.pri_1==1 ) {
            db.query("SELECT username from user where username = '" + req.body.username + "' and id != '" + req.body.id + "'",function(error,rows,fields){
                if (error) throw error;
                if (rows[0] != undefined ) {
                    var result = new Object();
                    result.Result = "ERROR";
                    result.Message = "用户名已存在！";
                    res.send(JSON.stringify(result));
                }
                else {
                    // console.log(req.body);
                    for (var i = 1; i <=9 ; i++) {
                        if (req.body["pri_"+i] == undefined)
                        {
                            req.body["pri_"+i] = '0';
                        }
                    };
                    var sql = helper.get_sql_str_update("user",req,"id");
                    // console.log(sql);
                    db.query(sql,function(error,rows,fields){
                        if (error) throw error;
                        var result = new Object();
                        result.Result = "OK";
                        res.send(JSON.stringify(result));
                    });
                }
            });
        }
        else
        {
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "权限不足！";
            res.send(JSON.stringify(result));
        }
    }
    else
    {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));        
    }
});

//delete user
router.post('/delete',function(req,res,next){
    if (req.session.allowed == 1 ) {
        if (req.session.pri_1==1 ) {
          db.query("DELETE from user where id = '" + req.body.id + "'",function (error,row,fields){
            if (error) throw error;
            var result = new Object();
            result.Result = "OK";
            res.send(JSON.stringify(result));
          });
        }
        else
        {
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "权限不足！";
            res.send(JSON.stringify(result));
        }
    }
    else {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});


//alter user
router.post('/privileges/add_games',function(req,res,next){
    console.log(req.body);
    if (req.session.userid == undefined) {
        res.send("no userid session");
    }
    else {
        db.query("SELECT id from user where id = '" + req.session.userid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
                res.send("userid not exist");
            }
            else {
                db.query("insert into user (`userid`,`gameid`) values ('"+req.session.userid+"','"+req.body.gameid+"')",function(error,rows,fields){
                   if (error) throw error;
                   res.send('ok');
                });
            }
        });
    };
});


// router.post('/privileges/alter_privileges',function(req,res,next){
//     db.query("SELECT id from user where id = '" + req.body.userid + "'",function(error,rows,fields){
//         if (error) throw error;
//         if (rows[0] == undefined) {
//             res.send("userid not exist");
//         }
//         else {
//             str = "update user set"
//             db.query("update user set ")
//         }

//     console.log(req.body);
// });


router.post('/list',function(req,res,next){
    db.query("SELECT * from user",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    });
});



module.exports = router;
