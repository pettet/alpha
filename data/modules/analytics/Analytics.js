
const os = require("os");

function Analytics(L,dbConn,httpServer,cfg){

  function loadHit(req,res){
    process.stdout.write("Analytics.loadHit"+os.EOL);
    /*
      dbConn.getConnection(function(err,connection){
        if(err)
          throw err;
        connection.query("select 1;",function(err,results,fields){
          connection.release();
          if(err)
            throw err;
          console.log(">>",results);
        });
      });
    */
  }

  httpServer.getRouter().use(function __getAnalytics(req,res,next){
    loadHit(req,res);
    next();
  });

}

module.exports = Analytics;
