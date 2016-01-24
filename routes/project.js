var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.allowed == 1 ) {
        res.render('project_control', { title: 'project_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//create project
router.post('/create',function(req,res,next){
    // console.log(req.body)
    if (req.session.allowed == 1 ) {
        db.query("SELECT vendorid from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined ) {
                var result = new Object();
                result.Result = "ERROR";
                result.Message = "供应商编号不存在！";
                res.send(JSON.stringify(result));
            }
            else {
                db.query("SELECT gameid from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
                    if(error) throw error;
                    if (rows[0] == undefined) {
                        var result = new Object();
                        result.Result = "ERROR";
                        result.Message = "游戏编号不存在！";
                        res.send(JSON.stringify(result));
                    } 
                    else {
                        db.query("SELECT projectid from project where gameid = '" + req.body.gameid + 
                        "' and vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
                            if(error) throw error;
                            if (rows[0] == undefined) {
                                var sql = helper.get_sql_str_insert("project",req);
                                // db.query("insert into project (`gameid`,`vendorid`,`dp_father`,`dp_child`) values ('"+req.body.gameid+"','"+req.body.vendorid+"','"+req.body.dp_father+"','"
                                // +req.body.dp_child + "')",function(error,rows,fields){
                                db.query(sql,function(error,rows,fields){
                                    if (error) throw error;
                                    db.query("SELECT * from project where gameid = '" + req.body.gameid + 
                                    "' and vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
                                        if (error) throw error;

                                        var result = new Object();
                                        result.Result = "OK";
                                        result.Record = rows[0];
                                        res.send(JSON.stringify(result));
                                    });
                                });
                            }
                            else {
                                var result = new Object();
                                result.Result = "ERROR";
                                result.Message = "条目重复！";
                                res.send(JSON.stringify(result));
                            }
                        });
                    }
                });
            }
        });
    }
    else
    {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

router.post('/update',function(req,res,next){
  if (req.session.allowed == 1 ) {
    db.query("SELECT vendorid from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined ) {
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "供应商编号不存在！";
            res.send(JSON.stringify(result));
        }
        else {
            db.query("SELECT gameid from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
                if(error) throw error;
                if (rows[0] == undefined) {
                    var result = new Object();
                    result.Result = "ERROR";
                    result.Message = "游戏编号不存在！";
                    res.send(JSON.stringify(result));
                } 
                else {
                    db.query("SELECT projectid from project where gameid = '" + req.body.gameid + 
                    "' and vendorid = '" + req.body.vendorid + "' and projectid != '" + req.body.projectid + "'",function(error,rows,fields){
                        if(error) throw error;
                        if (rows[0] == undefined) {
                            var sql = helper.get_sql_str_update("project",req,"projectid");
                            // db.query("update project set gameid = '" + req.body.gameid + "', vendorid = '" + 
                            // req.body.vendorid + "', dp_father = '" + req.body.dp_father + "', dp_child = '" + 
                            // req.body.dp_child + "' where projectid = '" + req.body.projectid + "'",function (error,row,fields){
                            db.query(sql,function (error,row,fields){
                              if (error) throw error;
                              var result = new Object();
                              result.Result = "OK";
                              res.send(JSON.stringify(result));
                            });
                        }
                        else {
                            var result = new Object();
                            result.Result = "ERROR";
                            result.Message = "条目重复！";
                            res.send(JSON.stringify(result));
                        }
                    });
                }
            });
        }
    });
  }
  else {
    var result = new Object();
    result.Result = "ERROR";
    result.Message = "登陆超时，请重新登陆！";
    res.send(JSON.stringify(result));
  }
});

router.post('/delete',function(req,res,next){
    if (req.session.allowed == 1 ) {
      db.query("DELETE from project where projectid = '" + req.body.projectid + "'",function (error,row,fields){
        if (error) throw error;
        var result = new Object();
        result.Result = "OK";
        res.send(JSON.stringify(result));
      });
    }
    else {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

router.post('/list',function(req,res,next){
    db.query("SELECT * from project",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
});

router.post('/get_game_options',function(req,res,next){
    db.query("SELECT * from game",function (error,rows,fields){
        if (error) throw error;
        var options = new Array();
        for(i=0;i<rows.length;i++)
        {
            options[i] = {"DisplayText":rows[i].name, "Value":rows[i].gameid}
        }
        var result = new Object();
        result.Result = "OK";
        result.Options = options;
        res.send(JSON.stringify(result));
    }) 
});

router.post('/get_vendorid_options',function(req,res,next){
    db.query("SELECT * from vendor",function (error,rows,fields){
        if (error) throw error;
        var options = new Array();
        for(i=0;i<rows.length;i++)
        {
            options[i] = {"DisplayText":rows[i].name, "Value":rows[i].vendorid}
        }
        var result = new Object();
        result.Result = "OK";
        result.Options = options;
        res.send(JSON.stringify(result));
    }) 
});




module.exports = router;
