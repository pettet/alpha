
var ws = new WebSocket("wss://kasper.host/foo",["test-proto-000"]);

ws.onopen = function __onopen(){
  ws.send("msg from cli");
};

ws.onerror = function __onerror(err){
  console.log("ws error "+err);
};

ws.onmessage = function __onmessage(ev){
  console.log("server: "+ev.data);
};
