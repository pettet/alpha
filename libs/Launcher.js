
const path = require("path");


function Launcher(){

  var L = this;
  L.ROOT = path.join("/home/pettet","alpha");
  L.LIBS = path.join(L.ROOT,"libs");
  L.DATA = path.join(L.ROOT,"data");
  L.NOOP = function __noop(){};

  var log = L.log = new (require(path.join(L.LIBS,"Logger.js")))({
    out_dir: path.join(L.ROOT,"logs"),
    pipe_stdout: true
  });

  log.info("Launcher","["+process.argv[2]+"]");

  switch(process.argv[2]){
    case "kasper-host":
      var appDir = path.join(L.DATA,"apps","kasper-host");
      var webapp = new (require(path.join(L.DATA,"modules","webapp")))(L,appDir);
      break;
    case "mary":
      var webapp = new (require(path.join(L.DATA,"apps","mary")))(L);
      break;
  }

}

module.exports = new Launcher;
