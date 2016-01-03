let __cookie = require(__dirname + "/Cookie.js");
let __utilities = require(__dirname + "/../Utilities.js");

let CookieManagerClass = class CookieManager {

  constructor() {
    this.cookies = {};
    this.setedCookies = {};
  }

  setup(cookiesString) {
    if(cookiesString != undefined || cookiesString != null) {
      for(var cookieString of cookiesString.split(";")) {
        var values = cookieString.split("=");
        this.cookies[values[0]] = JSON.parse(values[1]);
      }
    }
  }

  toHTTPField(field) {

    if(field == undefined) field = [];

    if(!__utilities.class.isEmpty(this.setedCookies)) {
      for(let key in this.setedCookies) {

          field.push(["Set-Cookie",this.setedCookies[key].toString()]);
      }
    }

    return field;

  }

  addCookie(cookie) {
    if(!(cookie instanceof __cookie.class)) throw new Error("addCookie cookie is not from type Cookie");
    this.setedCookies[cookie.name] = cookie;
  }

  deleteCookie(cookieName) {
    delete this.setedCookies[cookieName];
  }

  getValue(cookieName, key) {
    if(!__utilities.class.isEmpty(this.cookies)) {
      var cookie = this.cookies[cookieName];
      if(cookie) {
        return cookie[key];
      }
    }
  }

}

exports.class = CookieManagerClass;
