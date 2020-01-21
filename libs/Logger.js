
const fs = require("fs");
const path = require("path");
const os = require("os");
const moment = require("moment");

function Logger(cfg){

  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("display_level")) cfg.display_level = false;
  if(!cfg.hasOwnProperty("out_dir")) cfg.out_dir = path.join("./logs");
  if(!cfg.hasOwnProperty("pipe_stdout")) cfg.pipe_stdout = false;

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

  const COLORS = {
    "RESET": '\x1b[0m',
    "BRIGHT": '\x1b[1m',
    "DIM": '\x1b[2m',
    "UNDERSCORE": '\x1b[4m',
    "BLINK": '\x1b[5m',
    "REVESE": '\x1b[7m',
    "HIDDEN": '\x1b[8m',
    "FG_BLACK": '\x1b[30m',
    "FG_RED": '\x1b[31m',
    "FG_GREEN": '\x1b[32m',
    "FG_YELLOW": '\x1b[33m',
    "FG_BLUE": '\x1b[34m',
    "FG_MAGENTA": '\x1b[35m',
    "FG_CYAN": '\x1b[36m',
    "FG_WHITE": '\x1b[37m',
    "BG_BLACK": '\x1b[40m',
    "BG_RED": '\x1b[41m',
    "BG_GREEN": '\x1b[42m',
    "BG_YELLOW": '\x1b[43m',
    "BG_BLUE": '\x1b[44m',
    "BG_MAGENTA": '\x1b[45m',
    "BG_CYAN": '\x1b[46m',
    "BG_WHITE": '\x1b[47m',
  };

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
      let color = "FG_YELLOW";
      process.stdout.write(args.join(" ").padEnd(cfg.stdoutWidth-ts.length," ")+COLORS[color]+ts+COLORS.RESET+os.EOL);
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
