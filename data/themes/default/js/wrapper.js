
jQuery(function($){

  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register("/js/cli.js")
        .then(function(reg){
          console.log("done");
       }).catch(function(err) {
          console.log("Error", err)
      });
  }

});
