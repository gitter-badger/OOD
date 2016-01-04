let __cookie = require(__dirname + "/../lib/cookies/Cookie.js");
let __viewLoader = require(__dirname + "/../lib/ViewLoader.js");

function setupController(controller, viewName) {

  controller.model = {};

  let viewLoader = new __viewLoader.class(controller, controller.provider.config.viewFolderPath, {
    key : "Value"
  });

  viewLoader.load(viewName);
  viewLoader.parse();
  return viewLoader.viewContent;

}

class Test {

  showTestView() {
    var content = setupController(this, Test.name);
    return content;
  }

  showMessage(p1, p2) {
    var cookie = new __cookie.class("cookie");
    cookie.addValue("key1","value1");
    cookie.addValue("key2","value2");
    console.log(cookie);
    this.provider.cookieManager.addCookie(cookie);

    /*if(this.provider.sessionManager.session == null || this.provider.sessionManager.sessin == undefined) {
      this.provider.sessionManager.startSession(this.provider.cookieManager);
      this.provider.sessionManager.session.addValue("name","Marius");
      this.provider.sessionManager.save();
    }

    console.log(this.provider.sessionManager.session);*/

    if(this.parameter) {
        return "hdhdhdhd :D hammer " + this.parameter.message + " " + p1 + " " + p2;
    } else {
      return "Hallo";
    }

  }
}

//exports.class = Test;
