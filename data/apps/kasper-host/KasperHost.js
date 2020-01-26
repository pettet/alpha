
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
  themer.addGlobalReplacement("BrandUrl","https://kasper.host/");




  var emailQueue = new (require(path.join(L.DATA,"modules/email-queue")))(L,dbConn,{
    gmailUser: args.gmailUser,
    gmailClientId: args.gmailClientId,
    gmailClientSecret: args.gmailClientSecret,
    gmailRefreshToken: args.gmailRefreshToken,
  });





  wsServer.onConnect(function __onWsConnect(ws,req){
    if(req.__meta.ip==="192.168.1.1"){
      //console.log("local network");
    }
  });

  wsServer.onPacket(function __onWsPacket(ws,packet){
    //console.log(packet);
    /*if(packet.oc==="iam"&&packet.ua==="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"){
      ws.sendPacket({oc:"set-pg-title",title:"Kasper Security"});
      ws.sendPacket({oc:"set-pg-body",body:"<p>What <b>is</b> this?</p>"});
    }*/
  });

  wsServer.onClose(function __onWsClose(ws){
  });






/*  emailQueue.sendEmail({
    to: "pettet@hotmail.ca",
    from: "App Name <sikken83@gmail.com>",
    subject: "Test Subject",
    html: "<p>how much <b>wood</b> can a wood <u>chuck</u> chuck, if a wood <i>chuck</i> could chuck <b>wood></b>??</p>"
  },function(err,res){});*/




  httpServer.getRouter().use(function __getIndex(req,res,next){
    if(req.method!=="GET"||req.path!=="/") return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "${BrandName}";
    opts.replacements.PageContent = "index page";
    themer.render(req,res,opts);

    //console.log("__getIndex sid="+req.session.SID);

  });


  httpServer.getRouter().use(function __getServices(req,res,next){
    if(req.method!=="GET"||req.path!=="/services") return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Services - ${BrandName}";
    opts.replacements.PageContent = "services page";
    themer.render(req,res,opts);
  });


  httpServer.getRouter().use(function __getContact(req,res,next){
    if(req.method!=="GET"||req.path!=="/contact") return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Contact Us - ${BrandName}";
    opts.replacements.PageContent = "contact page";
    themer.render(req,res,opts);
  });



  httpServer.getRouter().use(function __getAuthIn(req,res,next){
    if(req.method!=="GET"||req.path!=="/auth-in") return next();
    if(req.session.get("is_logged")) return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Login - ${BrandName}";
    opts.replacements.PageContent = "login page";
    themer.render(req,res,opts);
  });




  httpServer.getRouter().use(function __getOffline(req,res,next){
    if(req.method!=="GET"||req.path!=="/offline.html") return next();
    if(req.session.get("is_logged")) return next();
    let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
    opts.replacements.PageTitle = "Offline - ${BrandName}";
    opts.replacements.PageContent = "this seems to be an offline template";
    themer.render(req,res,opts);
  });


  httpServer.getRouter().use(function __getAppmanifest(req,res,next){
    if(req.method!=="GET"||req.path!=="/manifest.json") return next();
    res.setHeader("Content-type","application/json");
    res.writeHead(200);
    res.end(JSON.stringify({
      "short_name": "Kasper",
      "name": "Kasper Security",
      "theme_color": "#004972",
      "background_color": "#004972",
      "display": "standalone",
      "icons": [
        {
          "src": "images/kasper_32.png",
          "type": "image/png",
          "sizes": "48x48"
        },
        {
          "src": "images/kasper_128.png",
          "type": "image/png",
          "sizes": "96x96"
        },
        {
          "src": "images/kasper_256.png",
          "type": "image/png",
          "sizes": "144x144"
        },
        {
          "src": "images/kasper_512.png",
          "type": "image/png",
          "sizes": "192x192"
        }
      ],
      "start_url": "/?utm_source=launcher"
    }));
  });



  httpServer.getRouter().use(function __getTest(req,res,next){
    if(req.method!=="GET"||req.path!=="/test") return next();
    res.setHeader("Content-type","text/plain");
    res.writeHead(200);
    res.end("test");
  });



  httpServer.listen(8000);

}

module.exports = KasperHost;
