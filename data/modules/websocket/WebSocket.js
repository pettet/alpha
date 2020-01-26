
const ws = require("ws");
const url = require("url");
const moment = require("moment");


function WebSocketServer(L,httpServer,wsMw,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};

  const wsServer = new ws.Server({
    noServer: true
  });

  var _onConnect = L.NOOP;
  var _onPacket = L.NOOP;
  var _onClose = L.NOOP;

  this.onConnect = function __onConnect(func){
    if(typeof func==="function")
      _onConnect = func;
  };

  this.onPacket = function __onPacket(func){
    if(typeof func==="function")
      _onPacket = func;
  };

  this.onClose = function __onClose(func){
    if(typeof func==="function")
      _onClose = func;
  };


  httpServer.on("upgrade",function _onHttpUpgrade(req,socket,head){
    const pathname = url.parse(req.url).pathname;
    if(pathname==="/api"){
      req.__meta = {
        stts: Date.now(),
        ip: req.headers["x-forwarded-for"]
      };
      wsMw(req,socket,head,function(err){
        wsServer.handleUpgrade(req,socket,head,function _onUpgrade(ws){
          wsServer.emit("connection",ws,req);
        });
      });
    }
    else{
      socket.destroy();
    }
  });




  wsServer.on("connection",function _onWsConnection(ws,req){

    log.verbose("WS CONNECTED",req.__meta.ip,req.headers["sec-websocket-protocol"]);

    ws.sendPacket = function _sendPacket(packet){
      let oc = packet.oc||"";
      ws.send(packet = JSON.stringify(packet));
      log.verbose("WS OUT","["+(oc||"")+"]",packet.length,"byte(s)");
    };

    ws.on("close",function __onClose(a,b){
      log.verbose("WS DISCONNECTED",req.__meta.ip);
      _onClose(ws,a,b);
    });

    ws.on("message",function _onMsg(raw){
      let packet;
      try{
        packet = JSON.parse(raw = raw.trim());
      }
      catch(ex){
        log.warn("FAILED TO PARSE PACKET",res.__meta.ip,ex.message);
      }
      log.verbose("WS  IN","["+req.__meta.ip+"]",(packet.oc||"--"),raw.length,"byte(s)");
      _onPacket(ws,packet);
    });

    _onConnect(ws,req);
  });



}



module.exports = {
  WebSocketServer
};
