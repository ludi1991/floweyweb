var express = require('express');
var router = express.Router();
var db = require('../db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('daily_control', { title: 'daily_control' });
});

//create user
router.post('/create',function(req,res,next){
    console.log(req.body)
    db.query("SELECT projectid from project where project = '" + req.body.projectid + "'",function(error,rows,fields){
    if (error) throw error;
    if (rows[0] == undefined ) {
        res.send("project not exist");
    }
    else {
       
    }
  });
});


//delete user
router.post('/delete',function(req,res,next){

});


//alter user
router.post('/alter',function(req,res,next){

});


router.get('/list',function(req,res,next){
    db.query("SELECT username,password from users",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        res.send(JSON.stringify(rows))
    }) 
});



module.exports = router;