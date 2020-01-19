
const path = require("path");
const fs = require("fs");

function Themer(L,httpServer,cfg){

  const log = L.log;
  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("default_theme")) cfg.default_theme = "default";

  const Utility = require(path.join(L.LIBS,"Utility.js"));

  var themer = this;
  var themeDir = path.join(L.DATA,"themes",cfg.default_theme);
  var templatesDir = path.join(themeDir,"templates");
  var _globalReplacements = [];

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

  themer.addGlobalReplacement = function __addGlobalReplacement(k,v){
    _globalReplacements[k] = v;
  };

  themer.render = function __render(req,res,opts){
    if(typeof opts!=="object") opts = {};
    if(!opts.hasOwnProperty("statusCode")) opts.statusCode = 200;
    if(!opts.hasOwnProperty("contentType")) opts.contentType = "text/html";
    if(!opts.hasOwnProperty("templates")) opts.templates = [];
    if(!opts.hasOwnProperty("replacements")) opts.replacements = {};
    for(let k in _globalReplacements){
      if(!opts.replacements.hasOwnProperty(k))
        opts.replacements[k] = _globalReplacements[k];
    }
    res.setHeader("Content-type",opts.contentType);
    res.writeHead(opts.statusCode);
    let outStream = new Utility.ReplaceStream({replacements:opts.replacements});
    outStream.pipe(res);
    streamTemplates(outStream,opts.templates,function(){
      outStream.end();
    },0);
  };



  var themeMod = require(themeDir);
  if(typeof themeMod==="function"){
    themeMod = new themeMod(L,httpServer,themer,cfg);
  }


}

module.exports = Themer;
