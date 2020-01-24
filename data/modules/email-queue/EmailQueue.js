
function EmailQueue(L,dbConn,cfg){

  var log = L.log;

  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("gmailEmail")) cfg.gmailEmail = "";
  if(!cfg.hasOwnProperty("gmailPwd")) cfg.gmailPwd = "";

}

module.exports = EmailQueue;
