
const path = require("path");

function Launcher(){

  var L = this;
  L.ROOT = path.join("/home/pettet","alpha");
  L.LIBS = path.join(L.ROOT,"libs");

  var log = L.log = new (require(path.join(L.LIBS,"Logger.js")))({
    out_dir: path.join(L.ROOT,"logs")
  });

  log.info("Launcher","init");

}

module.exports = new Launcher;
