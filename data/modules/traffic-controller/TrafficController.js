
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





  function Session(_raw){
    var sess = this;
    sess.SID = -1;
    var data = {};

    if(!typeof _raw==="object"){
      log.error("TrafficController: INIT SESSION WITH WRONG FORMATTED ARGS");
      _raw = {};
    }
    for(let i in _raw){
      if(i==="id") sess.SID = _raw[i];
      data[i] = _raw[i];
    }

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





  function createSession(req,next){
    //console.log(req);
    conn.query("insert into sessions (ip,origin,user_agent) values (?,?,?);",[
      req.__meta.ip,
      req.headers["referer"]||"",
      req.headers["user-agent"]||""
    ],function(err,results,fields){
      if(err) return process.nextTick(next,err);
      if(!results) return process.nextTick(next,null,null);
      log.verbose("TrafficController.createSession new sid",results.insertId);
      let session = new Session({id:results.insertId,ip:req.__meta.ip});
      process.nextTick(next,null,session);
    });
  }


  function loadSession(sid,next){
    conn.query("select * from sessions where id=? limit 1;",[sid],function(err,results,fields){
      if(err) return process.nextTick(next,err);
      if(results[0]){
        //log.verbose("TrafficController.loadSession sid",results[0].id);
        let session = new Session(results[0]);
        process.nextTick(next,null,session);
        return;
      }
      process.nextTick(next,null,null);
    });
  }


  function saveSession(session,next){
    process.nextTick(next);

    conn.query("update sessions set ts_lastseen=? where id=? limit 1;",[
      moment().format("YYYY-MM-DD HH:mm:ss"),
      session.SID
    ],function(err,results,fields){
      //console.log(">>>",arguments);
      if(err) return process.nextTick(next,err);
      if(!results) return process.nextTick(next,null,null);
      let session = new Session({ip:req.__meta.ip});
      process.nextTick(next,null,session);
    });
  }



  trafficController.mw = function __mw(req,res,next){
    req.__meta = { ip: res.__meta.ip };
    if(BLOCKED_IPS.indexOf(res.__meta.ip)>-1){
      log.warn("BLOCKED IP REQ",res.__meta.ip,req.method,req.url);
      res.setHeader("Content-type","text/plain");
      res.writeHead(403);
      res.end();
      return;
    }
    let sid = req.cookies.__sid;
    if(sid){
      loadSession(sid,function(err,session){
        if(err)
          throw err;
        if(!session){
          createSession(req,function(err,session){
            if(err)
              throw err;
            if(session){
              req.session = session;
              res.setHeader("Set-cookie","__sid="+req.session.SID);
              process.nextTick(next);
            }
          });
          return;
        }
        req.session = session;
        process.nextTick(next);
      });
      return;
    }
    createSession(req,function(err,session){
      if(err)
        throw err;
      if(session){
        req.session = session;
        res.setHeader("Set-cookie","__sid="+req.session.SID);
      }
      process.nextTick(next);
    });
  };


  trafficController.wsMw = function __wsMw(req,socket,head,next){
    if(BLOCKED_IPS.indexOf(req.__meta.ip)>-1){
      log.warn("WS BLOCKED",req.__meta.ip,req.method,req.url);
      socket.destroy();
      return;
    }

    //====
    //needs some attn here
    socket.session = new Session();
    //====

    process.nextTick(next);
  };

}

module.exports = TrafficController;
