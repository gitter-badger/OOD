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
    var dateString;

    if(this.cookieExpire == "") {
      dateString = this.cookieExpire;
    } else {
      let cookieDate = new Date(Date.now() + eval(this.cookieExpire));
      dateString = cookieDate.toGMTString();
    }

    let cookie = new __cookie.class("NODEJSSESSIONID",dateString, null, null, true);
    cookie.values = this.session.sessionId;
    return cookie;
  }

  loadSession(provider) {
    let cookie = provider.cookieManager.cookies["NODEJSSESSIONID"];

    if(cookie) {

      let sessionId = cookie;
      var session = this.objectSaver.load(sessionId);

      if(session) {

        if(new Date().getTime() <= new Date(session.expire).getTime()) {
          this.session = session;
          this.session.expire = new Date(Date.now() + eval(provider.config.session.sessionExpire)).toGMTString();
          this.save();
        }
      }

    }

  }

  startCleaner(interval) {
    console.log("Session Cleaner started with Interval ( " + eval(interval) + " )");
    let sessionManagerInstance = this;
    this.intervalObject = setInterval(() => {
      let files = __fs.readdirSync(sessionManagerInstance.sessionFolderPath);

      for(let file of files) {
        if(file != "." && file != "..") {
          var session = sessionManagerInstance.objectSaver.load(file.split(".")[0]);
          if(new Date(session.expire).getTime() <=  new Date().getTime()) {
            let filePath = sessionManagerInstance.sessionFolderPath + "/" + file;
            __fs.unlink(filePath);
            console.log("removed session file ( " + file + " )");
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
