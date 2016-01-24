var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 ) {
        res.render('vendor_control', { title: 'vendor_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//create project
router.post('/create',function(req,res,next){
  // console.log(req.body);
  if (req.session.allowed == 1 ) {
    db.query("SELECT name from vendor where name = '" + req.body.name + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT id from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
              var sql = helper.get_sql_str_insert("vendor",req);
              // db.query("insert into vendor (`name`,`vendorid`) values ('"+req.body.name+"','"+req.body.vendorid+"')",function(error,rows,fields){
              db.query(sql,function(error,rows,fields){
                if (error) throw error;
                db.query("SELECT * from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
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
              result.Message = "供应商编号已存在！";
              res.send(JSON.stringify(result));
            }
          });
        }
        else {
          var result = new Object();
          result.Result = "ERROR";
          result.Message = "供应商名称已存在！";
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
    db.query("SELECT name from vendor where name = '" + req.body.name + "' and id != '" + req.body.id + "'",function(error,rows,fields){
        if (error) throw error;
        if (rows[0] == undefined){
          db.query("SELECT id from vendor where vendorid = '" + req.body.vendorid + "' and id != '" + req.body.id + "'",function(error,rows,fields){
            if (error) throw error;
            if (rows[0] == undefined) {
              var sql = helper.get_sql_str_update("vendor",req,"id");
              // db.query("update vendor set name = '"+req.body.name+"', vendorid = '"+req.body.vendorid+"' where id = '"+req.body.id+"'",function(error,rows,fields){
              db.query(sql,function(error,rows,fields){
                if (error) throw error;
                var result = new Object();
                result.Result = "OK";
                res.send(JSON.stringify(result));
              });
            }
            else {
              var result = new Object();
              result.Result = "ERROR";
              result.Message = "供应商编号已存在！";
              res.send(JSON.stringify(result));
            }
          });
        }
        else {
          var result = new Object();
          result.Result = "ERROR";
          result.Message = "供应商名称已存在！";
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

//delete vendor
router.post('/delete',function(req,res,next){
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

//alter vendorname
router.post('/alter',function(req,res,next){
  console.log(req.body)
  db.query("SELECT vendorid from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
    if (error) throw error;
    if (rows[0] == undefined ) {
        res.send("vendorid not exist");
    }
    else {
        db.query("SELECT name from vendor where name = '" + req.body.name + "'",function(error,rows,fields){
           if(error) throw error;
           if (rows[0] == undefined) {
              db.query("UPDATE vendor set name = '"+req.body.name+"' where vendorid = '"+req.body.vendorid+"'",function(error,rows,fields){
                  if(error) throw error;
                  res.send("change ok");
              });
           } 
           else {
               res.send("vendorname exist");
           }
        });
    }
  });
})

//get vendor list
router.post('/list',function(req,res,next){
    db.query("SELECT * from vendor",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result))
    }) 
})


module.exports = router;
