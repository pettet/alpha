
const ws = require("ws");
const url = require("url");
const moment = require("moment");


function WebSocketServer(L,httpServer,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};

  const wsServer = new ws.Server({
    noServer: true
  });

  httpServer.on("upgrade",function _onHttpUpgrade(req,socket,head){
    const pathname = url.parse(req.url).pathname;
    if(pathname==="/api"){
      req.__meta = {
        stts: Date.now(),
        ip: req.headers["x-forwarded-for"]
      };
      wsServer.handleUpgrade(req,socket,head,function _onUpgrade(ws){
        wsServer.emit("connection",ws,req);
      });
    }
    else{
      socket.destroy();
    }
  });



  wsServer.on("connection",function _onWsConnection(ws,req){
    log.verbose("WS CONNECTED",req.__meta.ip,req.headers["sec-websocket-protocol"]);
    ws.sendPacket = function _sendPacket(packet){
      ws.send(JSON.stringify(packet));
    };
    ws.on("message",function _onMsg(raw){
      let packet;
      try{
        packet = JSON.parse(raw = raw.trim());
      }
      catch(ex){
        log.warn("FAILED TO PARSE PACKET",res.__meta.ip,ex.message);
      }
      log.verbose("received:",raw);
    });
    ws.sendPacket({msg:"msg from srv"});
  });



}



module.exports = {
  WebSocketServer
};
