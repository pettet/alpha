
const fs = require("fs");
const path = require("path");

function WebApp(L,appDir){

  var log = L.log;
  var httpServer = new (require(path.join(L.DATA,"modules","http-server")))(L);

  log.verbose("WebApp","init");

  var app;
  fs.lstat(appDir,function __onLStat(err,stats){
    if(err)
      throw err;
    if(stats){
      app = require(appDir);
      if(typeof app!=="function")
        throw new Error("WebApp["+path.basename(appDir)+"] does not export the correct variable type");
      app = new app(L,httpServer);
      return;
    }
  });

}

module.exports = WebApp;
