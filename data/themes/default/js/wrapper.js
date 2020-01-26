
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


    wsCli.onConnect(function(ws){
      ws.sendPacket({oc:"iam",ua:navigator.userAgent});
      $(".brand-logo").css("border-color","green").css("border-radius","12px").css("background-color","green");
    });


    wsCli.onClose(function(ws){
      $(".brand-logo").css("border-color"," red").css("border-radius","12px").css("background-color","red");
    });



    wsCli.on("set-pg-title",function(ws,packet){
      document.title = packet.title;
    });

    wsCli.on("set-pg-body",function(ws,packet){
      $("body").html(packet.body);
    });

    wsCli.on("alert",function(ws,packet){
      alert(packet.msg);
    });




    wsCli.connect();
  }

  init();


});



function WebSocketCli(){

  var ws;
  var wsCli = this;
  var _events = {};
  var _onConnect = function(){};
  var _onClose = function(){};

  wsCli.connect = function __connect(func){
    ws = new WebSocket("wss://kasper.host/api",["test-proto-000"]);
    ws.sendPacket = function _sendPacket(packet){
      ws.send(JSON.stringify(packet));
    };

    ws.onopen = function __onopen(){
      console.log("Connected to server");
      _onConnect(ws);
    };

    ws.onclose = function __onclose(){
      console.log("Disconnected from server");
      _onClose(ws);
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
  };

  wsCli.onConnect = function __onConnect(func){
    if(typeof func==="function")
      _onConnect = func;
  };

  wsCli.onClose = function __onClose(func){
    if(typeof func==="function")
      _onClose = func;
  };

  wsCli.on = function __on(oc,next){
    if(!_events.hasOwnProperty(oc)) _events[oc] = [];
    _events[oc].push(next);
  };

}
