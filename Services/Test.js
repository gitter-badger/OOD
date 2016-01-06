let __cookie = require(__dirname + "/../lib/cookies/Cookie.js");
let __viewLoader = require(__dirname + "/../lib/ViewLoader.js");

function setupController(controller, viewName) {

  controller.model = {};

  let viewLoader = new __viewLoader.class({
      controller: controller,
      viewFolderPath: controller.provider.config.viewFolderPath,
      model: {
        key : "Value"
      }
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

    /*var cookie = new __cookie.class({
      cookieName : "MariusCookie",
      expire: new Date(Date.now() + (60000 * 10)).toGMTString(),
      httpOnly: true
    });
    cookie.addValue("key1","value1");
    cookie.addValue("key2","value2");
    this.provider.cookieManager.addCookie(cookie);*/

    console.log(this.provider.cookieManager.cookies);


  /*if(this.provider.sessionManager.session == null || this.provider.sessionManager.session == undefined) {
    console.log("create session");
      this.provider.sessionManager.startSession(this.provider.cookieManager);
      this.provider.sessionManager.session.addValue("name","Marius");
      this.provider.sessionManager.save();
  }

    console.log("session");
    console.log(this.provider.sessionManager.session*/

    if(this.parameter) {
        return "hdhdhdhd :D hammer " + this.parameter.message + " " + p1 + " " + p2;
    } else {
      return "Hallo";
    }

  }
}

exports.class = Test;
