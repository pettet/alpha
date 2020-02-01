
const child_process = require("child_process");
const { PerformanceObserver, performance } = require("perf_hooks");

function Mary(L){

  const log = L.log;

  log.info("MARY","init");




  var proc = child_process.spawn("dstat",["--net"]);
  let n = 0;
  proc.stdout.on("data",function(raw){
    raw = raw.toString("utf8").trim();
    n++;
    if(n<4) return;

    raw = raw.split(" ");

console.log(" ");

    let stats = {
      net_recv: raw[0],
      net_send: raw[raw.length-1],
    };

    console.log(stats);

return;
    if(stats.cpu_use>5){
      console.log(log.COLORS.FG_RED+" CPU ALERT "+log.COLORS.RESET);
    }

  });

  proc.stderr.on("data",function(raw){
    console.log("ERR",raw);
  });


//console.log(proc);



  var _pingInterval = setInterval(function(){
    var ping = performance.now();
    process.nextTick(function(){
      ping = (performance.now()-ping).toFixed(4);
      //log.debug("PING",ping," ","this");
    });
  },10*1000);


}

module.exports = Mary;
