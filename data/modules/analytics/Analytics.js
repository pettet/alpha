
//const os = require("os");


function Analytics(L,dbConn,httpServer,cfg){

  var conn;

  function connectToDb(next){
    if(typeof next!=="function") next = L.NOOP;
    dbConn.getConnection(function(err,connection){
      if(err){
        console.log("ANA DB ERR: "+err.message);
        return next(err);
      }
      conn = connection;
      next();
    });
  }
  connectToDb();

  function logHit(req,res){
    res.on("finish",function __onResFinish(){
      setTimeout(function(){
        if(res.__meta.ana_hit_id){
          conn.query("update alpha.m_ana_hits set status_code=? where id=? limit 1;",[
            res.statusCode,
            res.__meta.ana_hit_id
          ],function(err,results,fields){
            if(err)
              throw err;
            //console.log(">>",results);
          });
        }
      },100);
    });
    conn.query("insert into alpha.m_ana_hits (url,ip,headers) values (?,?,?);",[
      req.url,
      res.__meta.ip,
      JSON.stringify(req.headers)
    ],function(err,results,fields){
      if(err)
        throw err;
      res.__meta.ana_hit_id = results.insertId;
    });
  }

  httpServer.getRouter().use(function __getAnalytics(req,res,next){
    //console.log(conn);
    if(!conn||conn.state!=="authenticated"){
      connectToDb(function(err){
        if(err){
          res.setHeader("Content-type","text/html");
          res.writeHead(500);
          res.end("failed to connect to database");
          return;
        }
        logHit(req,res);
        next();
      });
      return;
    }
    logHit(req,res);
    next();
  });

}

module.exports = Analytics;
