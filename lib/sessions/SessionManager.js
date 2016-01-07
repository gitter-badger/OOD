let __cookie = require(__dirname + "/../cookies/Cookie.js");
let __session = require(__dirname + "/Session.js");
let __objectSaver = require(__dirname + "/../ObjectSaver.js");
let __utilities = require(__dirname + "/../Utilities.js")
let __fs = require("fs");

class SessionManager {

  constructor(params) {
    this.cookieExpire = params.cookieExpire;
    this.sessionExpire = params.sessionExpire;
    this.sessionFolderPath = params.sessionFolderPath;
    this.fileEncoding = params.fileEncoding;
    this.objectSaver = new __objectSaver.class(this.sessionFolderPath,this.fileEncoding);
    this.session = params.session;
    this.sessions = (params.sessions) ? params.sessions : {};
    this.isFileSaving = params.isFileSaving;
    this.intervalObject = null;
  }

  startSession(cookieManager) {
    this.session = this.createSession();
    cookieManager.addCookie(this.createSessionCookie());
    if(!this.isFileSaving) {
        this.sessions[this.session.sessionId] = this.session;
    }
  }

  save() {
     this.objectSaver.save(this.session.sessionId, this.session);
  }

  createSession() {

    let newSession = () => {
      return new __session.class({
        sessionExpire: this.sessionExpire,
        sessionFolderPath: this.sessionFolderPath,
        fileEncoding:  this.fileEncoding
      });
    };

    var session;

    if(this.isFileSaving) {

      var isOkay = false;

      while(isOkay == false) {

        session = newSession();

        var sessionFilePath = this.sessionFilePath + "/" + session.sessionId + ".json";
        if(!__fs.existsSync(sessionFilePath)) {
          isOkay = true;
        }

      }

    } else {
      session = newSession();
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

    let cookie = new __cookie.class({
      cookieName: "NODEJSSESSIONID",
      expire: dateString,
      httpOnly: true,
      values: this.session.sessionId
    });

    return cookie;
  }

  loadSession(provider) {

    let cookie = provider.cookieManager.cookies["NODEJSSESSIONID"];

    if(cookie) {

      let sessionId = cookie;
      var session = (this.isFileSaving) ? this.objectSaver.load(sessionId) : this.sessions[sessionId];

      if(session) {

        if(new Date().getTime() <= new Date(session.expire).getTime()) {
          this.session = session;
          this.session.expire = new Date(Date.now() + eval(provider.config.session.sessionExpire)).toGMTString();
          (this.isFileSaving) ? this.save() : this.sessions[this.session.sessionId] = this.session;
        }

      } else {
        this.session = null;
      }

    }

  }

  startCleaner(interval) {
    console.log("Session Cleaner started with Interval ( " + eval(interval) + " )");
    let sessionManagerInstance = this;
    this.intervalObject = setInterval(() => {
      let sessions = (this.isFileSaving) ?  __fs.readdirSync(sessionManagerInstance.sessionFolderPath) : __utilities.class.parseObjectToArray(this.sessions);

      for(var session of sessions) {

        var file = session;
        if(this.isFileSaving) {
          if(file == "." || file == "..") continue;
          session = sessionManagerInstance.objectSaver.load(file.split(".")[0]);
        }

        if(new Date(session.expire).getTime() <=  new Date().getTime()) {
          if(this.isFileSaving) {
            let filePath = sessionManagerInstance.sessionFolderPath + "/" + file;
            __fs.unlink(filePath);
            console.log("removed session file ( " + file + " )");
          } else {
            delete this.sessions[session.sessionId];
            console.log("removed session ( " + session.toString() + " )");
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
