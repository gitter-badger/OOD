

class Cookie {

  constructor(name, expire, path, domain, httpOnly, security) {

    this.name = name;
    this.values = {};
    this.expire = (expire == undefined || expire == null) ? "" : expire;
    this.path = (path == undefined || path == null) ? "" : path;
    this.domain = domain;
    this.httpOnly = (httpOnly == undefined || httpOnly == null) ? "" : httpOnly;
    this.security = (security == undefined || security == null) ? "" : security;

  }

  addValue(key,value) {
    this.values[key] = value;
  }

  getValue(key) {
    return this.values[key];
  }

  toString() {
    var valuesString = JSON.stringify(this.values);
    if(valuesString == null || valuesString == undefined) valuesString = ""
    var param = "";
    param += this.name + "=" + valuesString + ";";
    param += "Expires=" + this.expire + ";";
    param += "Path=" + this.path + ";" ;
    param += "HttpOnly=" + this.httpOnly + ";" ;
    param += "Security=" + this.security + ";";
    if(this.domain != undefined || this.domain != null) param += "Domain=" + this.domain + ";";
    return param;
  }
}

exports.class = Cookie;
