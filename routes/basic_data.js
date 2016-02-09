var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 && req.session.pri_9==1) {
        res.render('basic_data_control', { title: 'basic_data_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//create
router.post('/create_game',function(req,res,next){
  // console.log(req.body);
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from game where name = '" + req.body.name + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT name from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
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

router.post('/create_cp',function(req,res,next){
  // console.log(req.body);
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from cp where name = '" + req.body.name + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT name from cp where cpid = '" + req.body.cpid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
              var sql = helper.get_sql_str_insert("cp",req);
              // db.query("insert into cp (`name`,`cpid`) values ('"+req.body.name+"','"+req.body.cpid+"')",function(error,rows,fields){
              db.query(sql,function(error,rows,fields){
                if (error) throw error;
                db.query("SELECT * from cp where cpid = '" + req.body.cpid + "'",function(error,rows,fields){
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
              result.Message = "CP编号已存在";
              res.send(JSON.stringify(result));
            }
          });
        }
        else {
          var result = new Object();
          result.Result = "ERROR";
          result.Message = "CP名称已存在";
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

router.post('/create_vendor',function(req,res,next){
  // console.log(req.body);
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from vendor where name = '" + req.body.name + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT name from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
              var sql = helper.get_sql_str_insert("vendor",req);            
              // db.query("insert into vendor (`name`,`vendorid`) values ('"+req.body.name+"','"+req.body.vendorid+"')",function(error,rows,fields){
              db.query(sql,function(error,rows,fields){
                if (error) throw error;
                db.query("SELECT * from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
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
              result.Message = "渠道编号已存在";
              res.send(JSON.stringify(result));
            }
          });
        }
        else {
          var result = new Object();
          result.Result = "ERROR";
          result.Message = "渠道名称已存在";
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

//update
router.post('/update_game',function(req,res,next){
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

router.post('/update_cp',function(req,res,next){
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from cp where name = '" + req.body.name + "' and id != '" + req.body.id + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        db.query("SELECT name from cp where cpid = '" + req.body.cpid + "' and id != '" + req.body.id + "'",function(error,rows,fields){
          if (error) throw error;
          if (rows[0] == undefined){
            var sql = helper.get_sql_str_update("cp",req,"id");
            // db.query("update cp set name = '" + req.body.name + "', cpid = '" + req.body.cpid + "' where id = '" + req.body.id + "'",function (error,row,fields){
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
            result.Message = "CP编号已存在";
            res.send(JSON.stringify(result));
          }
        });
      }
      else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "CP名称已存在";
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

router.post('/update_vendor',function(req,res,next){
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from vendor where name = '" + req.body.name + "' and id != '" + req.body.id + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        db.query("SELECT name from vendor where vendorid = '" + req.body.vendorid + "' and id != '" + req.body.id + "'",function(error,rows,fields){
          if (error) throw error;
          if (rows[0] == undefined){
            var sql = helper.get_sql_str_update("vendor",req,"id");
            // db.query("update vendor set name = '" + req.body.name + "', vendorid = '" + req.body.vendorid + "' where id = '" + req.body.id + "'",function (error,row,fields){
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
            result.Message = "渠道编号已存在";
            res.send(JSON.stringify(result));
          }
        });
      }
      else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "渠道名称已存在";
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

//delete
router.post('/delete_game',function(req,res,next){
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

router.post('/delete_cp',function(req,res,next){
    if (req.session.allowed == 1 ) {
      db.query("DELETE from cp where id = '" + req.body.id + "'",function (error,row,fields){
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

router.post('/delete_vendor',function(req,res,next){
    if (req.session.allowed == 1 ) {
      db.query("DELETE from vendor where id = '" + req.body.id + "'",function (error,row,fields){
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

//list
router.post('/list_game',function(req,res,next){
    console.log(req.body)
    db.query("SELECT * from game",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
})

router.post('/list_cp',function(req,res,next){
    console.log(req.body)
    db.query("SELECT * from cp",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
})

router.post('/list_vendor',function(req,res,next){
    console.log(req.body)
    db.query("SELECT * from vendor",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
})


module.exports = router;
