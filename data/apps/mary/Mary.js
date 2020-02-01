
const child_process = require("child_process");
const { PerformanceObserver, performance } = require("perf_hooks");

function Mary(L){

  const log = L.log;

  log.info("MARY","init");




  var proc = child_process.spawn("dstat",["--net","--load"]);
  let n = 0;
  proc.stdout.on("data",function(raw){
    raw = raw.toString("utf8").trim();
    n++;
    if(n<3) return;

    raw = raw.split("|");
    raw[0] = raw[0].split(" ");
    raw[1] = raw[1].split(" ");

    let stats = {
      net_recv: raw[0][0],
      net_send: raw[0][raw[0].length-1],
      load_1m: parseFloat(raw[1][0]),
      //load_5m: raw[1][1],
      //load_15m: raw[1][2],
    };

    var tickPing = performance.now();
    process.nextTick(function(){
      tickPing = performance.now()-tickPing;
      //====
      stats.tick_ms = tickPing;
      console.log(stats);

      /* the highest i could acheive was 1.92 for load_1m*/
      if(stats.load_1m>1.5){
        console.log(log.COLORS.FG_RED+" CPU ALERT "+log.COLORS.RESET);
      }
      //====
    });
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
