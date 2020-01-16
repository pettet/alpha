
const path = require("path");
const fs = require("fs");

function Themer(L,httpServer,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("default_theme")) cfg.default_theme = "default";

  var themer = this;
  var themeDir = path.join(L.DATA,"themes",cfg.default_theme);
  var templatesDir = path.join(themeDir,"templates");

  function streamTemplates(stream,templates,finale,index){
    let next = function __finaleWrapper(){
      process.nextTick(finale);
    };
    if(templates[index+1]){
      next = function __nextWrapper(){
        process.nextTick(function(){
          streamTemplates(stream,templates,finale,index+1);
        });
      };
    }
    if(templates[index]){
      fs.createReadStream(path.join(templatesDir,templates[index])).on("end",next).pipe(stream,{end:false});
      return;
    }
    next();
  }


  themer.render = function __render(req,res,opts){
    if(typeof opts!=="object") opts = {};
    if(!opts.hasOwnProperty("templates")) opts.templates = [];
    if(!opts.hasOwnProperty("replacements")) opts.replacements = {};

    res.setHeader("Content-type","text/html");
    res.writeHead(200);
    streamTemplates(res,opts.templates,function(){
      res.end();
    },0);
  };


  themer.static = function __static(prefix,dir){
    httpServer.getRouter().use(function __staticWrapper(req,res,next){
      if(req.method!=="GET"||!req.url.startsWith(prefix))
        return next();
      let localFile = path.join(dir,req.url.slice(prefix.length));
      fs.lstat(localFile,function __lStat(err,stats){
        if(err)
          return next();
        let ext = path.extname(localFile).slice(1);
        switch(ext){
          case "css":
            res.setHeader("Content-type","text/css");
            break;
          case "js":
            res.setHeader("Content-type","application/javascript");
            break;
        }
        res.writeHead(200);
        fs.createReadStream(localFile).pipe(res);
      });
    });
  };


}

module.exports = Themer;
