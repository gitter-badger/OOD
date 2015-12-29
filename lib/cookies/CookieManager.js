let cookie = require(__dirname + "/Cookie.js");
class CookieManager {

  constructor(cookies) {
    this.cookies = cookies;
  }

  toString() {
    var paramString = "";
    for (var cookie of this.cookies) {
      paramString += "Set-Cookie:" + cookie.toString();
    }
    return paramString;
  }

  toJSONObj() {
    var paramDic = {};
  }

  addCookie(object) {
    if(object !instanceof cookie.class) throw "addCookie cookie is not from type Cookie";
  }

}
