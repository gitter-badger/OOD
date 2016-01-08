let __http = require("http");
let __url = require("url");
let __fs = require("fs");
let __httpAuth = require(__dirname + "/HTTPAuth.js");
let __utilities = require(__dirname + "/Utilities.js");
let __cookieManager = require(__dirname + "/cookies/CookieManager.js");
let __sessionManager = require(__dirname + "/sessions/SessionManager.js");

let ProviderClass = class Provider {

  constructor(config) {
    this.config = config;
    this.request;
    this.responds;
    this.urlObject;
    this.cookieManager = new __cookieManager.class();
    this.contentType = null;
    this.sessionManager = new __sessionManager.class({
      sessionFolderPath: config.session.sessionFolderPath,
      cookieExpire: config.session.cookieExpire,
      sessionExpire: config.session.sessionExpire,
      fileEncoding: config.session.fileEncoding,
      isFileSaving: config.session.isFileSaving
    });
  }

  fetchPathComponents(pathname) {

    if(!pathname) {
      pathname = this.urlObject.pathname;
    }

    if(pathname.charAt(0) == '/') {
      pathname = pathname.slice(1, pathname.length);
    }

    if(pathname.charAt(pathname.length -1) == '/') {
      pathname = pathname.slice(0, (pathname.length - 1));
    }

    return pathname.split("/");

  }

  callService(servicePath, params) {

    console.log("Call Service ( " + servicePath + " ) with Methode " + this.request.method);

    // clean cache for the require service
    delete require.cache[require.resolve(servicePath)];

    let service = require(servicePath);

    if(typeof service.class == "function" && service.class) {

      var obj = new service.class();

      obj["provider"] = this;
      if(!__utilities.class.isEmpty(this.urlObject.query)) {
        obj["parameter"] = this.urlObject.query;

      }

      return obj[this.urlObject.components[1]].apply(obj, params);

    } else {
      throw new Error("Load Service ( " + servicePath + " ) falled the exports.class Property is not a function or is undefined or is null");
    }

  }

  fetchFileTypeObject(fileName) {

    if(fileName) {
      let index = fileName.indexOf(".");
      let type = fileName.substr(index + 1,(fileName.length  - index));
      let typeObject = this.config.extensionRules[type];
      return typeObject;
    } else {
      throw new Error("fileName is undefined or null");
    }

  }

  saveOperationHandler(operationBlock, error) {
    try {
        var content = operationBlock();
        this.responds.writeHead(200, this.cookieManager.toHTTPField([
          ['Content-Type',this.contentType]
        ]));
        this.responds.end(content);
    } catch(exeptionError) {
      if(error) {
        console.error(error);
        this.responds.writeHead(error.code, {'Content-Type': this.config.errorContentType});
        this.responds.end(JSON.stringify(error));
      } else if(exeptionError) {
        console.error(exeptionError.stack);
        this.responds.writeHead(520, {'Content-Type': this.config.errorContentType});
        this.responds.end(JSON.stringify(exeptionError.message));
      }
    }
  }

  createPath(startIndex, endIndex) {
    if(!endIndex) endIndex = this.urlObject.components.length;
      var pathArray = this.urlObject.components.slice(startIndex, endIndex);
      var path = "";

      for (var index in pathArray) {
          path += pathArray[index];
          if(index != pathArray.length - 1) {
            path += "/";
          }
      }

      return path;
  }

  createFolderListView(folderPath) {
    this.saveOperationHandler(() => {
      return JSON.stringify(__fs.readdirSync(folderPath));
    });
  }

  start() {

    var httpAuth;

    let setup = (req, res) => {

      /***
      *** set properties ***
      ***/
      this.request = req;
      this.responds = res;
      this.urlObject = __url.parse(req.url, true);
      this.urlObject.components = this.fetchPathComponents();

      /***
      *** setup ***
      ***/
      //cookies
      this.cookieManager.setup(this.request.headers.cookie);
      //sesion
      this.sessionManager.loadSession(this);
      httpAuth = new __httpAuth.class({
        request: this.request,
        responds: this.responds,
        realm: "Secure Area",
        message: "Pleas Login",
        authType: "Digest"
      });

    };

    let fileRequest = () => {
      // create file path
      var filePath = this.config.resourcesPath + this.createPath(0);
      var isFile = this.urlObject.components[this.urlObject.components.length - 1].indexOf(".");
      (isFile > -1) ? isFile = true : isFile = false;

      if(__fs.existsSync(filePath) || isFile) {
          // request to a file or to a folder

          let auth = httpAuth.login((isFile) ? this.config.resourcesPath + __utilities.class.fetchFolderPath(this.urlObject.components) : filePath);
          if(auth) {
            if(!isFile) {
              // this is a folder request
              // search to a index file
              for(let type of this.config.indexTypes) {
                var testPath = filePath + "/index." + type;
                  if(__fs.existsSync(testPath)) {
                    // founded index file
                    isFile = true;
                    filePath = testPath;
                    break;
                  } else {
                    this.createFolderListView(filePath);
                    break;
                  }
              }
            }

          if(isFile) {

              // this is a file request
              this.urlObject.components = this.fetchPathComponents(filePath);
              var lastPathComonents = this.urlObject.components[this.urlObject.components.length - 1];
              var typeObject = this.fetchFileTypeObject(lastPathComonents);
              if(!typeObject) {
                throw new Error("Cant find contentType for file ( " + lastPathComonents + " )");
              }
              this.contentType = typeObject.contentType;

              this.saveOperationHandler(() => {
                console.log("fetch file content from file == " + filePath);
                __fs.statSync(filePath);
                return __fs.readFileSync(filePath);
              });

            }
          }
          return true;
      } else {
        return false;
      }

    };

    let serviceRequest = () => {
      // request to a Service
      this.contentType = this.config.contentType;
      let serviceName = this.urlObject.components[0];
      var servicePath = this.config.servicesPath + serviceName + ".js";
      let auth = httpAuth.login(this.config.servicesPath,serviceName);
      if(auth) {
        this.saveOperationHandler(() => {

          __fs.statSync(servicePath);
          var params = this.urlObject.components.slice(2, this.urlObject.components.length);
          return this.callService(servicePath,params);

        });
      }
    };

    __http.createServer((req, res) => {

      setup(req, res);
      if(!fileRequest()) {
        serviceRequest();
      }

    }).listen(this.config.port, this.config.host);

    console.log("Server started");

    this.sessionManager.startCleaner(this.config.session.cleanerInterval);

  }

  static loadConfigObject(path) {
    try {
      var configPath = (path) ? path : __dirname + "/../config.js";
      __fs.statSync(configPath);
      var config = require(configPath);
      return config.object;
    } catch(error) {
      //TO-DO: create default config
      console.log(error);
    }
  }

}

exports.class = ProviderClass;
