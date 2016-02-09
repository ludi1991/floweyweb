var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 && (req.session.pri_5 == 1 ||req.session.pri_6 == 1)) {
        req.session.gameid = req.query.gameid;
        res.render('daily_control', { title: 'daily_control' });
    }
    else{
        res.redirect('/login');
    }
});

//create
router.post('/create',function(req,res,next){
    if (req.session.allowed == 1 ) {
        if (req.session.pri_5 == 1 ) {
            db.query("SELECT projectid from project where projectid = '" + req.body.projectid + "'",function (error,rows,fields){
                if (error) throw error;
                if (rows[0] == undefined ) {
                    var result = new Object();
                    result.Result = "ERROR";
                    result.Message = "项目编号不存在！";
                    res.send(JSON.stringify(result));
                }
                else {
                    var sql = "SELECT id from statistics where projectid = '" + req.body.projectid + "' and date = '" + req.body.date + "'";
                    db.query(sql,function (error,rows,fields){
                        if (error) throw error;
                        if(rows[0] == undefined ){
                            // var sql = "insert into statistics (`projectid`,`date`,`income`,`activate`,`newplayer`) values ('"+
                            //         req.body.projectid+"','"+
                            //         req.body.date+"','"+
                            //         req.body.income+"','"+
                            //         req.body.activate+"','"+
                            //         req.body.newplayer+"')";
                            var sql = helper.get_sql_str_insert("statistics",req);
                            console.log(sql);
                            db.query(sql,function (error,rows,fields){
                                if (error) throw error;
                                var sql = "SELECT s.id,s.projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date,s.income,s.download_cnt,s.newplayer,\
                                             s.arpu,s.stay_1,s.stay_7,s.stay_15,s.stay_30,g.gameid,g.name game_name,v.vendorid,v.name vendor_name,p.dp_main,p.dp_main_main,\
                                             p.dp_vendor,p.dp_vendor_vendor\
                                             from statistics as s, project as p, game as g, vendor as v\
                                             where p.projectid=s.projectid and p.gameid=g.gameid and p.vendorid=v.vendorid and s.projectid='"+req.body.projectid+
                                             "' and s.date='" + req.body.date + "'";
                                db.query(sql,function (error,rows,fields){
                                    if (error) throw error;
                                    rows[0].dp_main_value = Math.floor(rows[0].income * rows[0].dp_main);
                                    rows[0].dp_main_main_value = Math.floor(rows[0].dp_main_value * rows[0].dp_main_main);
                                    rows[0].dp_vendor_value = Math.floor(rows[0].income * rows[0].dp_vendor);
                                    rows[0].dp_vendor_vendor_value = Math.floor(rows[0].dp_vendor_value * rows[0].dp_vendor_vendor);
                                    var result = new Object();
                                    result.Result = "OK";
                                    result.Record = rows[0];
                                    // console.log(rows);
                                    res.send(JSON.stringify(result));
                                });
                            });
                        }
                        else{
                            var result = new Object();
                            result.Result = "ERROR";
                            result.Message = "重复的条目！";
                            res.send(JSON.stringify(result));
                        }
                    });
                }
            });
        }
        else{
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "权限不足！";
            res.send(JSON.stringify(result));
        }
    }
    else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

router.post('/update',function(req,res,next){
    if (req.session.allowed == 1 ) {
        if (req.session.pri_5 == 1 ) {
            db.query("SELECT projectid from project where projectid = '" + req.body.projectid + "'",function (error,rows,fields){
                if (error) throw error;
                if (rows[0] == undefined ) {
                    var result = new Object();
                    result.Result = "ERROR";
                    result.Message = "项目编号不存在！";
                    res.send(JSON.stringify(result));
                }
                else {
                    var sql = "SELECT id from statistics where projectid = '" + req.body.projectid + "' and date = '" + req.body.date + "' and id != '" +req.body.id+"'";
                    db.query(sql,function (error,rows,fields){
                        if (error) throw error;
                        if(rows[0] == undefined ){
                            var sql = helper.get_sql_str_update("statistics",req,"id");
                            // console.log(sql);
                            db.query(sql,function (error,rows,fields){
                                if (error) throw error;
                                var sql = "SELECT s.id,s.projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date,s.income,s.download_cnt,s.newplayer,\
                                             s.arpu,s.stay_1,s.stay_7,s.stay_15,s.stay_30,g.gameid,g.name game_name,v.vendorid,v.name vendor_name,p.dp_main,p.dp_main_main,\
                                             p.dp_vendor,p.dp_vendor_vendor\
                                             from statistics as s, project as p, game as g, vendor as v\
                                             where p.projectid=s.projectid and p.gameid=g.gameid and p.vendorid=v.vendorid and s.id='"+req.body.id+"'";
                                db.query(sql,function (error,rows,fields){
                                    if (error) throw error;
                                    rows[0].dp_main_value = Math.floor(rows[0].income * rows[0].dp_main);
                                    rows[0].dp_main_main_value = Math.floor(rows[0].dp_main_value * rows[0].dp_main_main);
                                    rows[0].dp_vendor_value = Math.floor(rows[0].income * rows[0].dp_vendor);
                                    rows[0].dp_vendor_vendor_value = Math.floor(rows[0].dp_vendor_value * rows[0].dp_vendor_vendor);
                                    var result = new Object();
                                    result.Result = "OK";   
                                    result.Record = rows[0];
                                    res.send(JSON.stringify(result));
                                });
                            });
                        }
                        else{
                            var result = new Object();
                            result.Result = "ERROR";
                            result.Message = "重复的条目！";
                            res.send(JSON.stringify(result));
                        }
                    });
                }
            });
        }
        else{
            var result = new Object();
            result.Result = "ERROR";
            result.Message = "权限不足！";
            res.send(JSON.stringify(result));
        }
    }
    else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

//delete statistics
router.post('/delete',function(req,res,next){
    if (req.session.allowed == 1 ) {
      if (req.session.pri_5 == 1 ) {
          db.query("DELETE from statistics where id = '" + req.body.id + "'",function (error,row,fields){
            if (error) throw error;
            var result = new Object();
            result.Result = "OK";
            res.send(JSON.stringify(result));
          });
      }
      else{
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "权限不足！";
        res.send(JSON.stringify(result));
      }
    }
    else {
        var result = new Object();
        result.Result = "ERROR";
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});


router.post('/list',function(req,res,next){
    console.log("gameid...."+req.session.gameid)
    var sql = "SELECT s.id,s.projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date,s.income,s.download_cnt,s.newplayer,\
             s.arpu,s.stay_1,s.stay_7,s.stay_15,s.stay_30,g.gameid,g.name game_name,v.vendorid,v.name vendor_name,p.dp_main,p.dp_main_main,\
             p.dp_vendor,p.dp_vendor_vendor\
             from statistics as s, project as p, game as g, vendor as v\
             where p.projectid=s.projectid and p.gameid=g.gameid and p.vendorid=v.vendorid and p.gameid='"+req.session.gameid+
             "' ORDER BY g.gameid,s.date";
    if(req.session.gameid == "all")
    {
        sql = "SELECT s.id,s.projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(s.date)*1000,')\/') date,s.income,s.download_cnt,s.newplayer,\
             s.arpu,s.stay_1,s.stay_7,s.stay_15,s.stay_30,g.gameid,g.name game_name,v.vendorid,v.name vendor_name,p.dp_main,p.dp_main_main,\
             p.dp_vendor,p.dp_vendor_vendor\
             from statistics as s, project as p, game as g, vendor as v\
             where p.projectid=s.projectid and p.gameid=g.gameid and p.vendorid=v.vendorid\
             ORDER BY g.gameid,s.date";
    }
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        for (var i = 0; i < rows.length; i++) {
            rows[i].dp_main_value = Math.floor(rows[i].income * rows[i].dp_main);
            rows[i].dp_main_main_value = Math.floor(rows[i].dp_main_value * rows[i].dp_main_main);
            rows[i].dp_vendor_value = Math.floor(rows[i].income * rows[i].dp_vendor);
            rows[i].dp_vendor_vendor_value = Math.floor(rows[i].dp_vendor_value * rows[i].dp_vendor_vendor);
        }
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
});

router.post('/get_project_options',function(req,res,next){
    var sql = "select p.projectid, v.name vendor_name, g.name game_name\
              from project as p, game as g, vendor as v where p.gameid=g.gameid and p.vendorid=v.vendorid and g.gameid='"+req.session.gameid+"'";
    if(req.session.gameid == "all")
    {
        sql = "select p.projectid, v.name vendor_name, g.name game_name\
              from project as p, game as g, vendor as v where p.gameid=g.gameid and p.vendorid=v.vendorid";
    }
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        var options = new Array();
        for(i=0;i<rows.length;i++)
        {
            options[i] = {"DisplayText":rows[i].game_name+"-"+rows[i].vendor_name, "Value":rows[i].projectid};
        }
        var result = new Object();
        result.Result = "OK";
        result.Options = options;
        res.send(JSON.stringify(result));
    });
});

router.post('/get_charts_option',function(req,res,next){
    var sql = "select s.projectid, v.name vendor_name, g.name game_name, UNIX_TIMESTAMP(s.date) date, s.income, s.activate, s.newplayer\
                from project as p, game as g, vendor as v, statistics as s\
                where p.gameid=g.gameid and p.vendorid=v.vendorid and s.projectid=p.projectid ORDER BY s.date, s.projectid";
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        var optionDataByDate = new Object();
        var projectName = new Object();
        for(i=0;i<rows.length;i++)
        {
            if(optionDataByDate[rows[i].date] == undefined){
                optionDataByDate[rows[i].date] = new Array();
            }
            optionDataByDate[rows[i].date][rows[i].projectid]={
                "name":rows[i].vendor_name+"-"+rows[i].game_name,
                "income":rows[i].income,
                "activate":rows[i].activate,
                "newplayer":rows[i].newplayer
            };

            // if(optionDataByName[rows[i].vendor_name+"-"+rows[i].game_name] == undefined){
            //     optionDataByName[rows[i].vendor_name+"-"+rows[i].game_name] = new Array();
            // }
            // optionDataByName[rows[i].vendor_name+"-"+rows[i].game_name] = true;
            projectName[rows[i].projectid] = rows[i].vendor_name+"-"+rows[i].game_name;
        }
        // var names = new Array();
        // for(name in optionDataByName){
        //     names.push(name);
        // }
        // console.log("optionDataByDate------------------------------");
        // console.log(optionDataByDate);
        var option = {
            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : []
        };
        if(req.body.chartType == "income"){
            option.title.text = '收入';
        }
        else if (req.body.chartType == "activate") {
            option.title.text = '激活用户数';
        }
        else if (req.body.chartType == "newplayer") {
            option.title.text = '新用户数';
        }
        // for(i=0;i<names.length;i++){
        //     option.legend.data[i] = names[i];
        // }
        for(id in projectName){
            option.legend.data.push(projectName[id]);
        }
        var firstDate;
        for(date in optionDataByDate){
            firstDate = parseInt(date);
            break;
        }
        var count = 0;
        for(date=firstDate;optionDataByDate[date.toString()]!=undefined;date=date+86400) //step:oneday
        {
            // console.log("-----------"+date);
            var t = new Date(date*1000);
            option.xAxis[0].data[count] = "" + (t.getMonth()+1) + "月" + t.getDate() + "日";
            // console.log("-----------"+option.xAxis[0].data[count]);
            count++;
        }
        for(projectid in projectName){
            var serie = new Object();
            serie.name = projectName[projectid];
            serie.type = 'line';
            serie.stack = '总量';
            serie.data = new Array();
            var count = 0;
            for(date=firstDate;optionDataByDate[date.toString()]!=undefined;date=date+86400) //step:oneday
            {
                // console.log("optionDataByDate[date.toString()]------------------------------");
                // console.log(optionDataByDate[date.toString()]);
                // console.log("i:"+i);
                // console.log("req.body.chartType:"+req.body.chartType);
                // console.log(optionDataByDate[date.toString()][i]);
                if(optionDataByDate[date.toString()][projectid] == undefined || 
                    optionDataByDate[date.toString()][projectid][req.body.chartType] == undefined){
                    serie.data[count] = '-';
                }
                else{
                    serie.data[count] = optionDataByDate[date.toString()][projectid][req.body.chartType];
                }
                count++;
            }
            option.series.push(serie);
        }
        // console.log(option);
        res.send(JSON.stringify(option));
    });  
});

module.exports = router;