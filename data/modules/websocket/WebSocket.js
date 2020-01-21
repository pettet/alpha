
const ws = require("ws");
const url = require("url");


function WebSocketServer(L,httpServer,cfg){
  if(typeof cfg!=="object") cfg = {};

  const wsServer = new ws.Server({
    noServer: true
  });

  httpServer.on("upgrade",function _onHttpUpgrade(req,socket,head){
    const pathname = url.parse(req.url).pathname;
    if(pathname==="/foo"){
      wsServer.handleUpgrade(req,socket,head,function _onUpgrade(ws){
        wsServer.emit("connection",ws,req);
      });
    }
    else{
      socket.destroy();
    }
  });

  wsServer.on("connection",function _onWsConnection(ws,req){
    console.log("ws connected",req.headers["sec-websocket-protocol"]);
    ws.on("message",function _onMsg(raw){
      console.log("received: "+raw);
    });
    ws.send("msg from srv");
  });
}



module.exports = {
  WebSocketServer
};
