

let CookieClass = class Cookie {

  constructor(name, expire, path, domain, httpOnly, security) {

    this.name = name;
    this.values = {};
    this.expire = expire;
    this.path = path;
    this.domain = domain;
    this.httpOnly = httpOnly;
    this.security = security;

  }

  addValue(key,value) {
    if(typeof this.values == "object") {
      if(key != undefined && key != null) {
        this.values[key] = value;
      } else {
        throw new Error("Key is undefined or null");
      }
    }
  }

  getValue(key) {
    if(typeof this.values == "object") {
      if(key != undefined && key != null) {
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
    if(valuesString == null || valuesString == undefined) valuesString = ""
    var param = this.name + "=" + valuesString + ";";
    param += "Expires=" + this.expire + ";";
    param += "Path=" + this.path + ";" ;
    if(this.httpOnly) {
      param += "HttpOnly=" + this.httpOnly + ";" ;
    }
    param += "Security=" + this.security + ";";
    if(this.domain != undefined || this.domain != null) param += "Domain=" + this.domain + ";";
    return param;
  }
}

exports.class = CookieClass;
