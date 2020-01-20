
//const os = require("os");


function Analytics(L,dbConn,httpServer,cfg){

  var conn;
  dbConn.getConnection(function(err,connection){
    if(err){
      console.log("ANA.logHit",err);
      return;
    }
    conn = connection;
    //conn.release();
  });


  function logHit(req,res){
    res.on("finish",function __onResFinish(){
      //console.log("__onResFinish");
      //include a res.statusCode update here
    });
    conn.query("insert into alpha.m_ana_hits (url,ip,headers) values (?,?,?);",[
      req.url,
      res.__meta.ip,
      JSON.stringify(req.headers)
    ],function(err,results,fields){
      if(err)
        throw err;
      //console.log(">>",results);
    });
  }

  httpServer.getRouter().use(function __getAnalytics(req,res,next){
    logHit(req,res);
    next();
  });

}

module.exports = Analytics;
