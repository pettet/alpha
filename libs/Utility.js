
const { Transform } = require("stream");
const util = require("util");

function ReplaceStream(opts){
  if(!(this instanceof ReplaceStream))
    return new ReplaceStream(opts);
  if(typeof opts!=="object") opts = {};
  if(!opts.hasOwnProperty("replacements")) opts.replacements = {};
  Transform.call(this,opts);
  this.opts = opts;
}

util.inherits(ReplaceStream,Transform);

ReplaceStream.prototype._transform = function __transform(raw,enc,next){
  raw = raw.toString("utf8");
  for(let n=0;n<3;n++){
    for(let k in this.opts.replacements){
      raw = raw.replace(new RegExp("\\${"+k+"}","g"),this.opts.replacements[k]);
    }
  }
  next(null,raw);
};

module.exports = {
  ReplaceStream
};
