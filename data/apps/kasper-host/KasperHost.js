
const path = require("path");

function KasperHost(L,httpServer){

  var log = L.log;
  var args = {};
  if(process.argv[2]){
    try{
      args = require(process.argv[2]);
    }catch(ex){
      throw ex;
    }
  }
  log.info("KasperHost","init");

  var dbConn = new (require(path.join(L.LIBS,"DatabaseConnection.js")))(L,{
    host: "192.168.1.104",
    user: "pettet",
    password: "i-W15h.T15h_W4$_4_G0OD_1",
    database: "alpha"
  });

  var analytics = new (require(path.join(L.DATA,"modules/analytics")))(L,dbConn,httpServer,{});
  var trafficController = new (require(path.join(L.DATA,"modules/traffic-controller")))(L,dbConn,{});
  httpServer.getRouter().use(trafficController.mw);
  var wsServer = new (require(path.join(L.DATA,"modules/websocket")).WebSocketServer)(L,httpServer,trafficController.wsMw,{});
  var themer = new (require(path.join(L.DATA,"modules/themer")))(L,httpServer,{});

  httpServer.getRouter().static("/images",path.join(L.DATA,"apps/kasper-host/images"));

  themer.addGlobalReplacement("BrandName","Kasper Security");




  var emailQueue = new (require(path.join(L.DATA,"modules/email-queue")))(L,dbConn,{
    gmailUser: args.gmailUser,
    gmailClientId: args.gmailClientId,
    gmailClientSecret: args.gmailClientSecret,
    gmailRefreshToken: args.gmailRefreshToken,
  });


  emailQueue.sendEmail({
    to: "pettet@hotmail.ca",
    from: "App Name <sikken83@gmail.com>",
    subject: "Test Subject",
    html: "<p>how much <b>wood</b> can a wood <u>chuck</u> chuck, if a wood <i>chuck</i> could chuck <b>wood></b>??</p>"
  },function(err,res){});




  httpServer.getRouter().use(function __getIndex(req,res,next){
    if(req.method!=="GET"||req.path!=="/")
     return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "${BrandName}";
    opts.replacements.PageContent = "index page";
    themer.render(req,res,opts);
  });

  httpServer.getRouter().use(function __getServices(req,res,next){
    if(req.method!=="GET"||req.path!=="/services")
     return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Services - ${BrandName}";
    opts.replacements.PageContent = "services page";
    themer.render(req,res,opts);
  });

  httpServer.getRouter().use(function __getContact(req,res,next){
    if(req.method!=="GET"||req.path!=="/contact")
     return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Contact Us - ${BrandName}";
    opts.replacements.PageContent = "contact page";
    themer.render(req,res,opts);
  });

  httpServer.getRouter().use(function __getAuthIn(req,res,next){
    if(req.method!=="GET"||req.path!=="/auth-in")
     return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Login - ${BrandName}";
    opts.replacements.PageContent = "login page";
    themer.render(req,res,opts);
  });




  httpServer.getRouter().use(function __getTest(req,res,next){
    if(req.method!=="GET"||req.path!=="/test")
     return next();
   res.setHeader("Content-type","text/plain");
   res.writeHead(200);
   res.end("test");
  });



  httpServer.listen(8000);

}

module.exports = KasperHost;
