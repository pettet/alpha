
const http = require("http");
const connect = require("connect");

function HttpServer(L,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};
  //if(!cfg.hasOwnProperty("port")) cfg.port = 8000;

  var router = connect();
  var httpServer = http.createServer(router);

  httpServer.on("listening",function __onHttpServerListening(){
    let addr = httpServer.address();
    log.verbose("HttpServer","server is listening","["+addr.family+"]"+addr.address+" "+addr.port);
  });

  router.use(function __internalHttpMw(req,res,next){
    /*
      uri-params
      cookies
    */
    next();
  });

  httpServer.getRouter = function __getRouter(){
    return router;
  };

  return httpServer;
}

module.exports = HttpServer;
