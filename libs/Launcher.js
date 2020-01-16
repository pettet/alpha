
const path = require("path");

function Launcher(){

  var L = this;
  L.ROOT = path.join("/home/pettet","alpha");
  L.LIBS = path.join(L.ROOT,"libs");
  L.DATA = path.join(L.ROOT,"data");

  var log = L.log = new (require(path.join(L.LIBS,"Logger.js")))({
    out_dir: path.join(L.ROOT,"logs")
  });

  log.info("Launcher","init");

  var httpServer = new (require(path.join(L.DATA,"modules","http-server")))(L);

  httpServer.getRouter().use(function __getIndex(req,res,next){
    if(req.method!=="GET"||req.url!=="/")
     return next();
    res.setHeader("Content-type","text/html");
    res.writeHead(200);
    res.end("<html><head><title>Kasper Security</title></head><body>network mitigation</body></html>");
  });

  httpServer.listen(8000);

}

module.exports = new Launcher;
