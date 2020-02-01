
function AdminPanel(L,dbConn,httpServer,themer,cfg){


    httpServer.getRouter().use(function __getIndex(req,res,next){
      if(req.method!=="GET"||req.path!=="/adm") return next();
      let opts = {templates:["head.html","blank.html","foot.html"],replacements:{}};
      opts.replacements.PageTitle = "Admin Panel - ${BrandName}";
      opts.replacements.PageContent = "admin panel";
      themer.render(req,res,opts);

      //console.log("__getIndex sid="+req.session.SID);

    });



}

module.exports = AdminPanel;
