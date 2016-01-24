var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('../public/javascripts/helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.allowed == 1 ) {
        res.render('daily_control', { title: 'daily_control' });
    }
    else{
        res.redirect('/login');
    }
});

//create user
router.post('/create',function(req,res,next){
    if (req.session.allowed == 1 ) {
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
                        // console.log(sql);
                        db.query(sql,function (error,rows,fields){
                            if (error) throw error;
                            var sql = "SELECT id,projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(date)*1000,')\/') date,income,activate,newplayer from statistics where projectid = '" 
                                        + req.body.projectid + "' and date = '" + req.body.date + "'";
                            db.query(sql,function (error,rows,fields){
                                if (error) throw error;
                                var result = new Object();
                                result.Result = "OK";
                                result.Record = rows[0];
                                console.log(rows);
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
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

router.post('/update',function(req,res,next){
    if (req.session.allowed == 1 ) {
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
                        // var sql = "update statistics set";
                        // for(var key in req.body)
                        // {
                        //     if(req.body[key]!=""){
                        //         sql = sql + " " + key + " = '" + req.body[key] + "',";
                        //     }
                        // }
                        // sql = sql.substring(0,sql.length-1); //去除最后一个','
                        // sql = sql + " where id = '" + req.body.id + "'";
                        var sql = helper.get_sql_str_update("statistics",req,"id");
                        // console.log(sql);
                        db.query(sql,function (error,rows,fields){
                            if (error) throw error;
                            var result = new Object();
                            result.Result = "OK";                         
                            res.send(JSON.stringify(result));
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
        result.Message = "登陆超时，请重新登陆！";
        res.send(JSON.stringify(result));
    }
});

//delete statistics
router.post('/delete',function(req,res,next){
    if (req.session.allowed == 1 ) {
      db.query("DELETE from statistics where id = '" + req.body.id + "'",function (error,row,fields){
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


//alter statistics
router.post('/alter',function(req,res,next){

});


router.post('/list',function(req,res,next){
    db.query("SELECT id,projectid, CONCAT('\/Date(',UNIX_TIMESTAMP(date)*1000,')\/') date,income,activate,newplayer from statistics\
             ORDER BY projectid,date",function (error,rows,fields){
        if (error) throw error;
        var result = new Object();
        result.Result = "OK";
        result.Records = rows;
        res.send(JSON.stringify(result));
    }) 
});

router.post('/get_project_options',function(req,res,next){
    var sql = "select p.projectid, v.name vendor_name, g.name game_name, p.dp_father, p.dp_child\
              from project as p, game as g, vendor as v where p.gameid=g.gameid and p.vendorid=v.vendorid";
    db.query(sql,function (error,rows,fields){
        if (error) throw error;
        var options = new Array();
        for(i=0;i<rows.length;i++)
        {
            options[i] = {"DisplayText":rows[i].vendor_name+"-"+rows[i].game_name, "Value":rows[i].projectid};
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
            series : [
                // {
                //     name:'邮件营销',
                //     type:'line',
                //     stack: '总量',
                //     data:[120, 132, 101, 134, 90, 230, 210]
                // },
                // {
                //     name:'联盟广告',
                //     type:'line',
                //     stack: '总量',
                //     data:[220, 182, 191, 234, 290, 330, 310]
                // },
                // {
                //     name:'视频广告',
                //     type:'line',
                //     stack: '总量',
                //     data:[150, 232, 201, 154, 190, 330, 410]
                // },
                // {
                //     name:'直接访问',
                //     type:'line',
                //     stack: '总量',
                //     data:[320, 332, '-', 334, 390, 330, 320]
                // },
                // {
                //     name:'搜索引擎',
                //     type:'line',
                //     stack: '总量',
                //     data:[820, 932, 901, 934, 1290, 1330, 1320]
                // }
            ]
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