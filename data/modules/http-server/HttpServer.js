
const http = require("http");
const qs = require("querystring");
const { performance, PerformanceObserver } = require("perf_hooks");
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

  router.use(function __uriParamsMw(req,res,next){
    res.__meta = {
      sts: performance.now(),
      ip: req.headers["x-forwarded-for"]
    };
    req.params = {};
    let paramIndex = req.url.indexOf("?");
    req.path = req.url;
    if(paramIndex>0){
      req.path = req.url.slice(0,paramIndex);
      req.params = req.url.slice(paramIndex+1);
      try{
        req.params = qs.parse(req.params);
      }
      catch(ex){
        log.warn("failed to parse incoming req-uri",res.__meta.ip);
      }
    }
    next();
  });

  router.use(function __cookiesMw(req,res,next){
    req.cookies = {};
    if(req.headers.cookie){
      let rawCookies = req.headers.cookie.trim().split(";");
      for(let i in rawCookies){
        let index = rawCookies[i].indexOf("=");
        if(index>1){
          req.cookies[rawCookies[i].slice(0,index).trim()] = rawCookies[i].slice(index+1).trim();
        }
      }
    }
    next();
  });

  httpServer.getRouter = function __getRouter(){
    return router;
  };

  return httpServer;
}

module.exports = HttpServer;
