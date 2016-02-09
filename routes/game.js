var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 && (req.session.pri_5 == 1 ||req.session.pri_6 == 1)) {
        res.render('game_control', { title: 'game_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

router.post('/list',function(req,res,next){
    var sql = "SELECT g.id,g.gameid,g.name game_name,CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date from game as g, project as p, statistics as s\
               where s.projectid=p.projectid and p.gameid=g.gameid ORDER BY g.gameid,s.date";
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        // console.log(rows);
        var newrows = new Array();
        newrows[0] = rows[0];
        for (var i = 0, j = 0; i < rows.length; i++) {
          if(newrows[j].gameid != rows[i].gameid)
          {
            newrows[++j] = rows[i];
          }
          newrows[j].end_date = rows[i].date;
        };
        var allgame = new Object();
        allgame.gameid = 'all';
        allgame.id = newrows[newrows.length-1].id + 1;
        newrows.push(allgame);
        // console.log("newrows----------------");
        // console.log(newrows);
        var result = new Object();
        result.Result = "OK";
        result.Records = newrows;
        res.send(JSON.stringify(result));
    }) 
})


module.exports = router;
