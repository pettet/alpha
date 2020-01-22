
function TrafficController(L,dbConn,cfg){

  const log = L.log;
  var trafficController = this;

  var BLOCKED_IPS = [];

  trafficController.mw = function __mw(req,res,next){
    if(BLOCKED_IPS.indexOf(res.__meta.ip)>-1){
      log.warn("BLOCKED IP REQ",res.__meta.ip,req.method,req.url);
      res.setHeader("Content-type","text/plain");
      res.writeHead(403);
      res.end();
      return;
    }
    next();
  };

  trafficController.wsMw = function __wsMw(req,socket,head,next){
    if(BLOCKED_IPS.indexOf(req.__meta.ip)>-1){
      log.warn("WS BLOCKED",req.__meta.ip,req.method,req.url);
      socket.destroy();
      return;
    }
    next();
  };

}

module.exports = TrafficController;
