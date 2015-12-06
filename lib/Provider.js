let http = require("http");
let url = require("url");
let fs = require("fs");
let utilities = require(__dirname + "/Utilities.js");

class Provider {

  constructor(config) {
    this.config = config;
    this.contentType = config.contentType;
    this.request;
    this.responds;
    this.urlObject;
    this.components;
    this.requestType;
    this.utilities = new utilities.class();
  }

  fetchPathComponents() {

    let pathname = this.urlObject.pathname;

    if(pathname.charAt(0) == '/') {
      pathname = pathname.slice(1, pathname.length);
    }

    if(pathname.charAt(pathname.length -1) == '/') {
      pathname = pathname.slice(0, (pathname.length - 1));
    }

    return pathname.split("/");

  }

  callModul(modulPath, params) {
    console.log("callModul " + modulPath);
    let modul = require(modulPath);
    var obj = new modul.class();

    obj["provider"] = this;

    if(!utilities.class.isEmpty(this.urlObject.query)) {

      obj["parameter"] = this.urlObject.query;

    }

    return obj[this.components[1]].apply(obj, params);

  }

  fetchFileTypeObject(fileName) {

    if(fileName != undefined) {
      let index = fileName.indexOf(".");
      let type = fileName.substr(index + 1,(fileName.length  - index));
      let typeObject = this.config.extensionRules[type];
      return typeObject;
    }

  }

  saveOperationHandler(operationBlock, error) {

    try {
      var content = operationBlock();
      this.responds.writeHead(200, {'Content-Type': this.contentType});
      this.responds.end(content);
    } catch(exeptionError) {
      if(exeptionError == null && error == null) {
        this.responds.writeHead(520, {'Content-Type': this.config.errorContentType});
        this.responds.end("{error:{message:'error message'}}");
      } else if(exeptionError) {
        this.responds.writeHead(520, {'Content-Type': this.config.errorContentType});
        this.responds.end(JSON.stringify(exeptionError));
      } else if(error) {
        this.responds.writeHead(error.code, {'Content-Type': this.config.errorContentType});
        this.responds.end(JSON.stringify(error));
      }
    }

  }

  createPath(startIndex, endIndex) {
    if(endIndex == null) endIndex = this.components.length;
      var pathArray = this.components.slice(startIndex, endIndex);
      var path = "";

      for (var index in pathArray) {
          path += pathArray[index];
          if(index != pathArray.length - 1) {
            path += "/";
          }
      }

      return path;
  }

  start() {
    var providerInstance = this;

    http.createServer((req, res) => {

      // set properties
      providerInstance.request = req;
      providerInstance.responds = res;
      providerInstance.urlObject = url.parse(req.url, true);
      providerInstance.components = providerInstance.fetchPathComponents();

      var isFile = providerInstance.components[providerInstance.components.length - 1].indexOf(".");

      if(isFile > -1) {

          var filePath = __dirname + "/../Resources/" + providerInstance.createPath(0);
          var lastPathComonents = providerInstance.components[providerInstance.components.length - 1];

          var typeObject = providerInstance.fetchFileTypeObject(lastPathComonents);
          providerInstance.contentType = typeObject.contentType;

          providerInstance.saveOperationHandler(() => {
            console.log("fetch file content");
            fs.statSync(filePath);
            return fs.readFileSync(filePath);

          });

      } else {

        providerInstance.contentType = providerInstance.config.contentType;
        var modulPath = __dirname + "/../Services/" + providerInstance.components[0] + ".js";

        providerInstance.saveOperationHandler(() => {

          fs.statSync(modulPath);
          var params = providerInstance.components.slice(2, providerInstance.components.length);
          return providerInstance.callModul(modulPath,params);

        },{ // error object
          message : "error message hdhd",
          code: 503
        });

      }

    }).listen(this.config.port, this.config.host);

    console.log("Server started");
  }

  static loadConfigObject() {
    try {
      var configPath = __dirname + "/../config.js";
      fs.statSync(configPath);
      var config = require(configPath);
      return config.object;
    } catch(error) {
      //TO-DO: create default config
      console.log(error);
    }
  }

}

exports.class = Provider;
