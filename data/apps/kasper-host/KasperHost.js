
const path = require("path");

function KasperHost(L,httpServer){

  var log = L.log;
  log.info("KasperHost","init");

  var dbConn = new (require(path.join(L.LIBS,"DatabaseConnection.js")))(L,{
    host: "192.168.1.104",
    user: "pettet",
    password: "i-W15h.T15h_W4$_4_G0OD_1",
    database: "alpha"
  });

  httpServer.getRouter().use(function __getIndex(req,res,next){
    if(req.method!=="GET"||req.path!=="/")
     return next();
    res.setHeader("Content-type","text/html");
    res.writeHead(200);
    res.end("<html><head><title>Kasper Security</title></head><body>Network Mitigation</body></html>");
  });



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




  httpServer.listen(8000);

}

module.exports = KasperHost;
