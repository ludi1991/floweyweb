var express = require('express');
var router = express.Router();
var db = require('../db');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 ) {
        res.render('user_control', { title: 'user_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//create user
router.post('/create',function(req,res,next){
    console.log(req.body);
    db.query("SELECT username from user where username = '" + req.body.username + "'",function(error,rows,fields){
    if (error) throw error;
    if (rows[0] != undefined ) {
        res.send("username exist");
    }
    else {
        db.query("insert into user (`username`,`password`) values ('"+req.body.username+"','"+req.body.password+"')",function(error,rows,fields){
              if (error) throw error;
              res.send('ok');
        });
    }
  });
});


//delete user
router.post('/delete',function(req,res,next){

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


router.get('/list',function(req,res,next){
    db.query("SELECT username,password from user",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        res.send(JSON.stringify(rows));
    }) 
});



module.exports = router;
