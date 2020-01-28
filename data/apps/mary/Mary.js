
const { PerformanceObserver, performance } = require("perf_hooks");

function Mary(L){

  const log = L.log;

  log.info("MARY","init");


  var _pingInterval = setInterval(function(){
    var ping = performance.now();
    process.nextTick(function(){
      ping = (performance.now()-ping).toFixed(4);
      log.debug("PING",ping," ","this");
    });
  },10*1000);


}

module.exports = Mary;
