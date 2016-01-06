let __utilities = require(__dirname + "/../Utilities.js");
let __fs = require("fs");

let SessionClass = class Session  {

  constructor(params) {
    this.expire = (!params.sessionExpire) ? "" : new Date(Date.now() + eval(params.sessionExpire)).toGMTString();
    this.sessionId = this.createSessionId();
    this.sessionFolderPath = params.sessionFolderPath;
    this.fileEncoding = params.fileEncoding;
    this.data = params.data;
  }

  createSessionId() {
    return __utilities.class.createUUID();
  }

  addValue(key, value) {
    if(!this.data) {
      this.data = {};
    }

    this.data[key] = value;
  }

}

exports.class = SessionClass;
