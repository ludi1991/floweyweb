var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 ) {
        res.render('game_control', { title: 'game_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//create project
router.post('/create',function(req,res,next){
  // console.log(req.body);
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from game where name = '" + req.body.name + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT id from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
              var sql = helper.get_sql_str_insert("game",req);            
              // db.query("insert into game (`name`,`gameid`) values ('"+req.body.name+"','"+req.body.gameid+"')",function(error,rows,fields){
              db.query(sql,function(error,rows,fields){
                if (error) throw error;
                db.query("SELECT * from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
                  if(error) throw error;
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
              result.Message = "游戏编号已存在";
              res.send(JSON.stringify(result));
            }
          });
        }
        else {
          var result = new Object();
          result.Result = "ERROR";
          result.Message = "游戏名称已存在";
          res.send(JSON.stringify(result));
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
    db.query("SELECT name from game where name = '" + req.body.name + "' and id != '" + req.body.id + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        db.query("SELECT name from game where gameid = '" + req.body.gameid + "' and id != '" + req.body.id + "'",function(error,rows,fields){
          if (error) throw error;
          if (rows[0] == undefined){
            var sql = helper.get_sql_str_update("game",req,"id");
            // db.query("update game set name = '" + req.body.name + "', gameid = '" + req.body.gameid + "' where id = '" + req.body.id + "'",function (error,row,fields){
            db.query(sql,function (error,row,fields){
              if (error) throw error;
              var result = new Object();
              result.Result = "OK";
              res.send(JSON.stringify(result));
            });
          }
          else{
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "游戏编号已存在";
            res.send(JSON.stringify(result));
          }
        });
      }
      else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "游戏名称已存在";
        res.send(JSON.stringify(result));
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

//delete game
router.post('/delete',function(req,res,next){
    if (req.session.allowed == 1 ) {
      db.query("DELETE from game where id = '" + req.body.id + "'",function (error,row,fields){
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

//alter gamename
router.post('/alter',function(req,res,next){
  console.log(req.body)
  db.query("SELECT gameid from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
    if (error) throw error;
    if (rows[0] == undefined ) {
        res.send("gameid not exist");
    }
    else {
        db.query("SELECT name from game where name = '" + req.body.name + "'",function(error,rows,fields){
           if(error) throw error;
           if (rows[0] == undefined) {
              db.query("UPDATE game set name = '"+req.body.name+"' where gameid = '"+req.body.gameid+"'",function(error,rows,fields){
                  if(error) throw error;
                  res.send("change ok");
              });
           } 
           else {
               res.send("gamename exist");
           }
        });
    }
  });
})

router.post('/list',function(req,res,next){
    db.query("SELECT * from game",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
})


module.exports = router;
