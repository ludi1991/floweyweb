var express = require('express');
var router = express.Router();
var db = require('../db');

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
  console.log(req.body);
  db.query("SELECT name from vendor where name = '" + req.body.name + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        db.query("SELECT id from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
          if (error) throw error;
          if (rows[0] == undefined) {
            db.query("insert into vendor (`name`,`vendorid`) values ('"+req.body.name+"','"+req.body.vendorid+"')",function(error,rows,fields){
              if (error) throw error;
              res.send('ok');
            })
          }
          else {
            res.send("vendorid exist");
          }
        })
      }
      else {
        res.send("vendorname exist");
      }

  });
  
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
router.get('/list',function(req,res,next){
    db.query("SELECT vendorid,name from vendor",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        res.send(JSON.stringify(rows))
    }) 
})


module.exports = router;
