var express = require('express');
var router = express.Router();
var db = require('../db');

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
  console.log(req.body);
  db.query("SELECT name from game where name = '" + req.body.name + "'",function(error,rows,fields){
      if (error) throw error;
      if (rows[0] == undefined){
        db.query("SELECT id from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
          if (error) throw error;
          if (rows[0] == undefined) {
            db.query("insert into game (`name`,`gameid`) values ('"+req.body.name+"','"+req.body.gameid+"')",function(error,rows,fields){
              if (error) throw error;
              res.send('ok');
            });
          }
          else {
            res.send("gameid exist");
          }
        })
      }
      else {
        res.send("gamename exist");
      }

  });
  
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

router.get('/list',function(req,res,next){
    db.query("SELECT gameid,name from game",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        res.send(JSON.stringify(rows))
    }) 
})


module.exports = router;
