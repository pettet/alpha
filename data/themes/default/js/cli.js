
function WebSocketCli(){

  var ws = new WebSocket("wss://kasper.host/api",["test-proto-000"]);
  var wsCli = this;

  var _events = {};

  wsCli.on = function __on(oc,next){
    if(!_events.hasOwnProperty(oc)) _events[oc] = [];
    _events[oc].push(next);
  };

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
    if(!packet.oc){
      console.log("CORRUPT PACKET WITH NO OC");
      return;
    }
    if(_events.hasOwnProperty(packet.oc)){
      for(let i in _events[packet.oc]){
        _events[packet.oc][i](ws,packet);
      }
    }
  };

}

var wsCli = new WebSocketCli;

wsCli.on("alert",function(ws,packet){
  alert(packet.msg);
});
