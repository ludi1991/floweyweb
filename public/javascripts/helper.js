function get_sql_str_insert(tablename, req){
    var sql = "insert into "+tablename+" (";
    for(var key in req.body)
    {
        if(req.body[key]!=""){
            sql = sql + "`" + key + "`,"
        }
    }
    sql = sql.substring(0,sql.length-1); //去除最后一个','
    sql = sql + ") values (";
    for(var key in req.body)
    {
        if(req.body[key]!=""){
            sql = sql + "'" + req.body[key] + "',"
        }
    }
    sql = sql.substring(0,sql.length-1); //去除最后一个','
    sql = sql + ")";
    return sql;
}

function get_sql_str_update(tablename, req, keyname){
    var sql = "update "+tablename+" set";
    for(var key in req.body)
    {
        if(req.body[key]!=""){
            sql = sql + " " + key + " = '" + req.body[key] + "',";
        }
    }
    sql = sql.substring(0,sql.length-1); //去除最后一个','
    sql = sql + " where "+keyname+" = '" + req.body[keyname] + "'";
    return sql;
}

function go_where_you_can(req){
    var ans = "";
    if(req.session.pri_1 == 1 || req.session.pri_2 == 1){
        ans = "/users";
    }
    else if(req.session.pri_3 == 1 || req.session.pri_4 == 1){
        ans = "/project";
    }
    else if(req.session.pri_5 == 1 || req.session.pri_6 == 1){
        ans = "/game";
    }
    else if(req.session.pri_7 == 1){
        ans = "/vendor";
    }
    else if(req.session.pri_8 == 1){
        ans = "/cp";
    }
    else if(req.session.pri_9 == 1){
        ans = "/basic_data";
    }
    return ans;
}

module.exports.get_sql_str_insert = get_sql_str_insert;
module.exports.get_sql_str_update = get_sql_str_update;
module.exports.go_where_you_can = go_where_you_can;