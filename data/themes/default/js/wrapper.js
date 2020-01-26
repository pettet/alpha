
jQuery(function($){


  if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/js/cli.js",{scope:"./js/"}).then(function(reg){
          console.log("service worker registered",reg.scope);
       }).catch(function(err){
          console.log("serviceWorker error",err)
      });
  }



  function init(){
    var wsCli = new WebSocketCli;





    wsCli.on("set-pg-title",function(ws,packet){
      document.title = packet.title;
    });

    wsCli.on("set-pg-body",function(ws,packet){
      $("body").html(packet.body);
    });

    wsCli.on("alert",function(ws,packet){
      alert(packet.msg);
    });



  }

  init();


});



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
    console.log("Connected to server");
    ws.sendPacket({oc:"iam",ua:navigator.userAgent});
  };

  ws.onclose = function __onclose(){
    console.log("Disconnected from server");
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
