let __cookie = require(__dirname + "/../cookies/Cookie.js");
let __session = require(__dirname + "/Session.js");
let __objectSaver = require(__dirname + "/../ObjectSaver.js");
let __fs = require("fs");

class SessionManager {

  constructor(sessionFolderPath, cookieExpire, sessionExpire, fileEncoding) {
    this.cookieExpire = cookieExpire;
    this.sessionExpire = sessionExpire;
    this.sessionFolderPath = sessionFolderPath;
    this.fileEncoding = fileEncoding;
    this.objectSaver = new __objectSaver.class(this.sessionFolderPath,this.fileEncoding);
    this.session = null;
    this.intervalObject = null;
  }

  startSession(cookieManager) {
    this.session = this.createSession();
    cookieManager.addCookie(this.createSessionCookie());
  }

  save() {
     this.objectSaver.save(this.session.sessionId, this.session);
  }

  createSession() {
    var isOkay = false;
    var session;
    while(isOkay == false) {
      session = new __session.class(this.sessionExpire, this.sessionFolderPath, this.fileEncoding);
      var sessionFilePath = this.sessionFilePath + "/" + session.sessionId + ".json";
      if(!__fs.existsSync(sessionFilePath)) {
        isOkay = true;
      }
    }

    return session;
  }

  createSessionCookie() {
    let cookie = new __cookie.class("SessionManagerCookie",this.cookieExpire);
    cookie.addValue("sid",this.session.sessionId);
    return cookie;
  }

  loadSession(cookieManager) {
    let cookie = cookieManager.cookies["SessionManagerCookie"];
    if(cookie != null && cookie != undefined) {
      let sessionId = cookie["sid"];
      var session = this.objectSaver.load(sessionId);
      if(session != null && session != undefined) {
        if(Date.now() <= session.expire) {
          this.session = session;
        }
      }

    }

  }

  startCleaner(interval) {
    console.log("Session Cleaner started with Interval = " + eval(interval));
    let sessionManagerInstance = this;
    this.intervalObject = setInterval(() => {
      let files = __fs.readdirSync(sessionManagerInstance.sessionFolderPath);

      for(let file of files) {
        if(file != "." && file != "..") {
          var session = sessionManagerInstance.objectSaver.load(file.split(".")[0]);
          if(session.expire <= Date.now()) {
            let filePath = sessionManagerInstance.sessionFolderPath + "/" + file;
            __fs.unlink(filePath);
            console.log("removed session file = " + file);
          }
        }

      }
    },eval(interval));
  }

  endCleaner() {
    cleanerInterval(this.intervalObject);
  }

}

exports.class = SessionManager;
