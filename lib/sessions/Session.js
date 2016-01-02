let __utilities = require(__dirname + "/../Utilities.js");
let __fs = require("fs");

class Session  {

  constructor(sessionExpire, sessionFolderPath, fileEncoding) {
    this.expire = (sessionExpire == undefined || sessionExpire == null) ? "" : sessionExpire;
    this.sessioniId = this.createSessionId();
    this.sessionFolderPath = sessionFolderPath;
    this.fileEncoding = fileEncoding;
    this.data = null;
  }

  setup() {
    if(!(__fs.existsSync(this.sessionPath))) {
      __fs.closeSync(fs.openSync(this.sessionPath, 'w'));
    }
  }

  createSessionId() {
    return __utilities.class.createUUID();
  }

  addValue(key, value) {
    if(this.data != undefined && this.data != null) {
      this.data[key] = value;
    }
  }

}
