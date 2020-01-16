
function KasperHost(L,httpServer){

  var log = L.log;
  log.info("KasperHost","init");


  httpServer.getRouter().use(function __getIndex(req,res,next){
    if(req.method!=="GET"||req.url!=="/")
     return next();
    res.setHeader("Content-type","text/html");
    res.writeHead(200);
    res.end("<html><head><title>Kasper Security</title></head><body>Network Mitigation</body></html>");
  });


  httpServer.listen(8000);

}

module.exports = KasperHost;
