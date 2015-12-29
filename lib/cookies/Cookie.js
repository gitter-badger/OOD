
let cookieValue = require(__dirname + "/CookieValue.js");

class Cookie {

  constructor(name, value, expire) {
    this.name = name;
    this.values = (value instanceof cookieValue.class) ? [value] : throw "Cookie value is not from type CookieValue";
    this.expire = expire;
  }

  addValue(value) {
    if(value !instanceof cookieValue.class) throw "Cookie value is not from type CookieValue"
    this.values.push(value);
  }

  toString() {

    var valuesString = "";

    for(let index in this.values.keys) {
      if(index != this.values.keys.length - 1) {
        valuesString += this.values[this.values.keys[index]] + ";";
      }
    }

    var param = "name=" + this.name + ";" + "Expires=" + this.expire + ";" + valuesString;

  }
}

exports.class = Cookie;
