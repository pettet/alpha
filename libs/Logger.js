
const fs = require("fs");
const path = require("path");
const os = require("os");
const moment = require("moment");

function Logger(cfg){

  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("display_level")) cfg.display_level = false;
  if(!cfg.hasOwnProperty("out_dir")) cfg.out_dir = path.join("./logs");
  if(!cfg.hasOwnProperty("pipe_stdout")) cfg.pipe_stdout = true;

  cfg.stdoutWidth = process.stdout.columns;
  cfg.stdoutHeight = process.stdout.rows;

  try{
    let stats = fs.lstatSync(cfg.out_dir);
    if(!stats){
      fs.mkdirSync(cfg.out_dir,{recursive:true});
    }
    createStream();
  }catch(ex){
    if(ex.code!=="ENOENT")
      throw ex;
    fs.mkdirSync(cfg.out_dir,{recursive:true});
    createStream();
  }

  var logger = this;

  const LEVELS = {
    1: "VERBOSE",
    2: "DEBUG",
    4: "INFO",
    8: "WARN",
    16: "ERROR"
  };

  for(let lv in LEVELS)
    logger[LEVELS[lv]] = +lv;

  const LVALS = Object.values(LEVELS);

  var outStream;

  function createStream(){
    if(!outStream)
      outStream = fs.createWriteStream(path.join(cfg.out_dir,"node-["+process.pid+"].log"),{flags:"a"});
  }

  logger.log = function __log(){
    let args = Array.prototype.slice.call(arguments);
    let lv = args.shift();
    if(!LEVELS[lv]) throw new Error("log level ["+lv+"] not supported");
    if(cfg.display_level)
      outStream.write(LEVELS[lv]+" ");
    outStream.write(lv+"-"+Date.now()+"-"+args.join(" ")+os.EOL);
    if(cfg.pipe_stdout){
      let ts = "["+moment().format("LTS")+"]";
      process.stdout.write(args.join(" ").padEnd(cfg.stdoutWidth-ts.length," ")+'\x1b[36m'+ts+'\x1b[0m'+os.EOL);
    }
  };

  logger.verbose = function __verbose(){
    logger.log(logger.VERBOSE,...arguments);
  };

  logger.debug = function __debug(){
    logger.log(logger.DEBUG,...arguments);
  };

  logger.info = function __info(){
    logger.log(logger.INFO,...arguments);
  };

  logger.warn = function __warn(){
    logger.log(logger.WARN,...arguments);
  };

  logger.error = function __error(){
    logger.log(logger.ERROR,...arguments);
  };

}

module.exports = Logger;
