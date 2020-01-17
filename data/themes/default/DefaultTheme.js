
const path = require("path");

function DefaultTheme(L,httpServer,themer,cfg){

  var log = L.log;
  var themeDir = path.join(L.DATA,"themes",cfg.default_theme);
  var templatesDir = path.join(themeDir,"templates");

  var router = httpServer.getRouter();
  router.static("/css",path.join(themeDir,"css"));
  router.static("/fonts",path.join(themeDir,"fonts"));
  router.static("/images",path.join(themeDir,"images"));
  router.static("/js",path.join(themeDir,"js"));

}

module.exports = DefaultTheme;
