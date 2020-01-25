
const nodemailer = require("nodemailer");


function EmailQueue(L,dbConn,cfg){

  var log = L.log;

  if(typeof cfg!=="object") cfg = {};
  if(!cfg.hasOwnProperty("gmailUser")) cfg.gmailUser = "";
  if(!cfg.hasOwnProperty("gmailClientId")) cfg.gmailClientId = "";
  if(!cfg.hasOwnProperty("gmailClientSecret")) cfg.gmailClientSecret = "";
  if(!cfg.hasOwnProperty("gmailRefreshToken")) cfg.gmailRefreshToken = "";

  var emailQueue = this;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: cfg.gmailUser,
      clientId: cfg.gmailClientId,
      clientSecret: cfg.gmailClientSecret,
      refreshToken: cfg.gmailRefreshToken,
      //accessToken: serverConfig.gmail.access_token,
    },
  });


  emailQueue.sendEmail = function __sendEmail(opts,next){
    if(typeof opts!=="object") opts = {};
    if(!opts.hasOwnProperty("from")) opts.from = "";
    if(!opts.hasOwnProperty("to")) opts.to = "";
    if(!opts.hasOwnProperty("subject")) opts.subject = "--";
    if(!opts.hasOwnProperty("html")) opts.html = "<p></p>";
    if(!opts.from)
      return process.nextTick(next,"Failed to send email, no 'from' email specified.");
    if(!opts.to)
      return process.nextTick(next,"Failed to send email, no 'to' email specified.");
    transporter.sendMail(opts,function __onSendEmail(err,res){
      console.log(arguments);
      if(err)
        return process.nextTick(next,err);
      process.nextTick(next,null,res);
    });
  };


}

module.exports = EmailQueue;
