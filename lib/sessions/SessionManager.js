let __cookie = require(__dirname + "/../cookies/Cookie.js");
let __session = require(__dirname + "/Session.js");
let __objectSaver = require(__dirname + "/../ObjectSaver.js");

class SessionManager {

  constructor(sessionFolderPath, cookieExpire, sessionExpire, fileEncoding) {
    this.cookieExpire = cookieExpire;
    this.sessionExpire = sessionExpire;
    this.sessionFolderPath = sessionFolderPath;
    this.fileEncoding = fileEncoding;
    this.session = null;
  }

  startSession() {
    this.session = createSession();
    createSessionCookie();
  }

  createSession() {
    return new __session.class(this.sessionExpire, this.sessionFolderPath, this.fileEncoding);
  }

  createSessionCookie() {
    let cookie = new __cookie.class("SessionManagerCookie",this.cookieExpire);
    cookie.addValue("sid",this.session.sessionId);
  }

  loadSession(cookieManager) {
    let cookie = cookieManager.cookies["SessionManagerCookie"];
    if(cookie != null && cookie != undefined) {
      let sessionId = cookie.getValue("sid");
      let objectSaver = new __objectSaver.class(this.sessionFolderPath,this.fileEncoding);
      objectSaver.load(sessionId);
    } else {
      cookie = null;
    }

  }

  startCleaner(interval) {

  }

  endCleaner() {

  }

}

exports.class = SessionManager;
