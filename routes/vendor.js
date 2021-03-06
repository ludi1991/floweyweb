var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 && req.session.pri_7 == 1) {
        res.render('vendor_control', { title: 'vendor_control' , session : req.session });
    }
    else {
        res.redirect('/login');
    }
});

//get vendor list
router.post('/list',function(req,res,next){
    var sql = "SELECT g.gameid,g.name game_name,v.vendorid,v.name vendor_name,CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date,\
               s.income,s.newplayer,p.dp_vendor,p.dp_vendor_vendor\
               from game as g, project as p, statistics as s, vendor as v\
               where s.projectid=p.projectid and p.gameid=g.gameid and p.vendorid=v.vendorid ORDER BY v.vendorid,g.gameid,s.date";
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        var newrows = new Array();
        newrows[0] = rows[0];
        newrows[0].n_income = 0;
        newrows[0].n_newplayer = 0;
        for (var i = 0, j = 0; i < rows.length; i++) {
          if(rows[i].vendorid != newrows[j].vendorid || rows[i].gameid != newrows[j].gameid)
          {
            newrows[j].dp_vendor_vendor_value = Math.floor(newrows[j].n_income * newrows[j].dp_vendor * newrows[j].dp_vendor_vendor);
            newrows[++j] = rows[i];
            newrows[j].n_income = 0;
            newrows[j].n_newplayer = 0;
          }
          newrows[j].end_date = rows[i].date;
          newrows[j].n_income = newrows[j].n_income + rows[i].income;
          newrows[j].n_newplayer = newrows[j].n_newplayer + rows[i].newplayer;
          // console.log("rows[i]------------");
          // console.log(rows[i]);
          // console.log("newrows[j]------------");
          // console.log(newrows[j]);
        };
        //the last record do not have "dp_vendor_vendor_value"
        newrows[newrows.length-1].dp_vendor_vendor_value = Math.floor(newrows[newrows.length-1].n_income * newrows[newrows.length-1].dp_vendor * newrows[newrows.length-1].dp_vendor_vendor);
        console.log(newrows);
        var result = new Object();
        result.Result = "OK";
        result.Records = newrows;
        res.send(JSON.stringify(result))
    }) 
});


module.exports = router;
