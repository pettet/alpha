
const mysql = require("mysql");


function DatabaseConnection(L,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("connectionLimit")) cfg.connectionLimit = 10;
  if(!cfg.hasOwnProperty("host")) cfg.host = "localhost";
  if(!cfg.hasOwnProperty("user")) cfg.user = "root";
  if(!cfg.hasOwnProperty("password")) cfg.password = "";
  if(!cfg.hasOwnProperty("database")) cfg.database = "alpha";

  var dbConn = this;
  var pool = mysql.createPool(cfg);

  dbConn.getConnection = function __getConnection(next){
    pool.getConnection(next);
  };

}

module.exports = DatabaseConnection;
