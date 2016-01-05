let __utilities = require(__dirname + "/../Utilities.js");
let __fs = require("fs");

let SessionClass = class Session  {

  constructor(sessionExpire, sessionFolderPath, fileEncoding) {
    this.expire = (!sessionExpire) ? "" : new Date(Date.now() + eval(sessionExpire)).toGMTString();
    this.sessionId = this.createSessionId();
    this.sessionFolderPath = sessionFolderPath;
    this.fileEncoding = fileEncoding;
    this.data = null;
  }

  createSessionId() {
    return __utilities.class.createUUID();
  }

  addValue(key, value) {
    if(this.data == undefined || this.data == null) {
      this.data = {};
    }

    this.data[key] = value;
  }

}

exports.class = SessionClass;
