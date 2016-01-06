

let CookieClass = class Cookie {

  constructor(params) {

    this.cookieName = params.cookieName;
    this.values = (params.values) ? params.values : {};
    this.expire = params.expire;
    this.path = params.path;
    this.domain = params.domain;
    this.httpOnly = params.httpOnly;
    this.security = params.security;

  }

  addValue(key,value) {
    if(typeof this.values == "object") {
      if(key) {
        this.values[key] = value;
      } else {
        throw new Error("Key is undefined or null");
      }
    }
  }

  getValue(key) {
    if(typeof this.values == "object") {
      if(key) {
        return this.values[key];
      } else {
        throw new Error("Key is undefined or null");
      }
    } else {
      return this.values;
    }
  }

  toString() {
    var valuesString = (typeof this.values == "object") ? JSON.stringify(this.values) : this.values;
    if(!valuesString) valuesString = ""
    var param = this.cookieName + "=" + valuesString + ";";
    param += "Expires=" + this.expire + ";";
    param += "Path=" + this.path + ";" ;
    if(this.httpOnly) {
      param += "HttpOnly=" + this.httpOnly + ";" ;
    }
    param += "Security=" + this.security + ";";
    if(this.domain) param += "Domain=" + this.domain + ";";
    return param;
  }
}

exports.class = CookieClass;
