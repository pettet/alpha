
function WebSocketCli(){

  var ws = new WebSocket("wss://kasper.host/api",["test-proto-000"]);

  ws.sendPacket = function _sendPacket(packet){
    ws.send(JSON.stringify(packet));
  };

  ws.onopen = function __onopen(){
    ws.sendPacket({msg:"msg from cli"});
  };

  ws.onerror = function __onerror(err){
    console.log("ws error "+err);
  };

  ws.onmessage = function __onmessage(ev){
    let packet;
    try{
      packet = JSON.parse(ev.data.trim());
    }
    catch(ex){
      console.log("failed to parse incomming packet:",ex.message);
    }
    console.log("server:",packet);
  };

}

var wsCli = new WebSocketCli;
