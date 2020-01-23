
const moment = require("moment");

function TrafficController(L,dbConn,cfg){

  const log = L.log;
  var trafficController = this;

  var conn;

  function connectToDb(next){
    if(typeof next!=="function") next = L.NOOP;
    dbConn.getConnection(function(err,connection){
      if(err){
        log.error("TRAFFIC DB ERR: "+err.message);
        return next(err);
      }
      conn = connection;
      next();
    });
  }
  connectToDb();

  const START_TIME = moment("20200101","YYYYMMDD").format("YYYY-MM-DD HH:mm:ss");
  var BLOCKED_IPS = [];


  var trafficScannerInterval = setInterval(function __trafficScanner(){
    conn.query("select ip from blocked_ips where until_ts between ? and ?;",[
      START_TIME,
      moment().add(7,"days").format("YYYY-MM-DD HH:mm:ss")
    ],function(err,results,fields){
      if(err)
        throw err;
      if(results){
        let NEW_LIST = [];
        for(let i in results){
          NEW_LIST.push(results[i].ip);
        }
        BLOCKED_IPS = NEW_LIST;
        NEW_LIST = null;
      }
      //log.verbose(BLOCKED_IPS);
    });
  },15*1000);



  function Session(){
    var sess = this;
    var data = {};

    sess.get = function __get(k){
      if(!data.hasOwnProperty(k))
        return undefined;
      return data[k];
    };
    sess.set = function __set(k,v){
      data[k] = v;
    };

    return sess;
  }



  trafficController.mw = function __mw(req,res,next){
    if(BLOCKED_IPS.indexOf(res.__meta.ip)>-1){
      log.warn("BLOCKED IP REQ",res.__meta.ip,req.method,req.url);
      res.setHeader("Content-type","text/plain");
      res.writeHead(403);
      res.end();
      return;
    }
    req.session = new Session();
    next();
  };

  trafficController.wsMw = function __wsMw(req,socket,head,next){
    if(BLOCKED_IPS.indexOf(req.__meta.ip)>-1){
      log.warn("WS BLOCKED",req.__meta.ip,req.method,req.url);
      socket.destroy();
      return;
    }
    socket.session = new Session();
    next();
  };

}

module.exports = TrafficController;
