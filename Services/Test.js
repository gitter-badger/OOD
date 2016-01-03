let __cookie = require(__dirname + "/../lib/cookies/Cookie.js");

class Test {
  showMessage(p1, p2) {

    /*var cookie = new __cookie.class("cookie");
    cookie.addValue("key1","value1");
    cookie.addValue("key2","value2");
    this.provider.cookieManager.addCookie(cookie);*/

    this.provider.sessionManager.startSession(this.provider.cookieManager);
    this.provider.sessionManager.session.addValue("name","Marius");
    this.provider.sessionManager.save();

    console.log(this.provider.sessionManager.session);

    if(this.parameter) {
        return "hdhdhdhd :D hammer " + this.parameter.message + " " + p1 + " " + p2;
    } else {
      return "Hallo";
    }

  }
}

exports.class = Test;
