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

module.exports.get_sql_str_insert = get_sql_str_insert;
module.exports.get_sql_str_update = get_sql_str_update;