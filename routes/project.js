var express = require('express');
var router = express.Router();
var db = require('../db');

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
    console.log(req.body)
    db.query("SELECT vendorid from vendor where vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
    if (error) throw error;
    if (rows[0] == undefined ) {
        res.send("vendorid not exist");
    }
    else {
        db.query("SELECT gameid from game where gameid = '" + req.body.gameid + "'",function(error,rows,fields){
            if(error) throw error;
            if (rows[0] == undefined) {
               res.send("gameid not exist")
            } 
            else {
                db.query("SELECT projectid from game where nameid gameid = '" + req.body.gameid + 
                "' and vendorid = '" + req.body.vendorid + "'",function(error,rows,fields){
                    if(error) throw error;
                    if (rows[0] == undefined) {
                        db.query("insert into project (`gameid`,`vendorid`,`dp_father`,`dp_child`) values ('"+req.body.gameid+"','"+req.body.vendorid+"','"+req.body.dp_father+"','"
                            +req.body.dp_child + "')",function(error,rows,fields){
                            if (error) throw error;
                            res.send("success");
                        });
                    }
                    else {
                        res.send("same project is exist")
                    }
                });
            }
        });
    }
  });
});


router.get('/list',function(req,res,next){
    db.query("SELECT * from project",function (error,rows,fields){
        if (error) throw error;
        console.log(rows);
        res.send(JSON.stringify(rows))
    }) 
});




module.exports = router;
