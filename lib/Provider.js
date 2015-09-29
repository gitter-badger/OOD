var http = require("http");
var url = require("url");
var fs = require("fs");

function Provider(config) {

  this.config = config;
  this.contentType = config.contentType;
  this.request;
  this.responds;
  this.urlObject;
  this.components;
  this.requestType;

  this.fetchPathComponents = function() {
    var pathname = this.urlObject.pathname;

    if(pathname.charAt(0) == '/') {
      pathname = pathname.slice(1, pathname.length);
    }

    if(pathname.charAt(pathname.length -1) == '/') {
      pathname = pathname.slice(0, (pathname.length - 1));
    }

    return pathname.split("/");
  }

  this.callModul = function(modulPath, params) {

    var modul = require(modulPath);
    var obj = new modul.object();
    obj["provider"] = this;

    for(var key in this.urlObject.query) {
      obj[key] = this.urlObject.query[key];
    }

    return obj[this.components[1]].apply(obj, params);

  }

  this.fetchFileTypeObject = function(fileName) {
      var index = fileName.charAt(".");
      var type = fileName.substr(index,(fileName.length - 1 - index));
      console.log("type: " + type);
      var typeObject = this.config.extensionRules[type];
      return typeObject;
  }

  this.saveOperationHandler = function(operationBlock, error) {
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

  this.createPath = function(startIndex, endIndex) {

      if(endIndex == null) endIndex = this.components.length;

      var pathArray = this.components.splice(startIndex, endIndex);
      var path = "";
      for (var index in pathArray) {
          path += pathArray[index];
          if(index != pathArray.length - 1) {
            path += "/";
          }
      }
      return path;
  }

  var providerInstance = this;

  http.createServer(function (req, res) {

    // set properties
    providerInstance.request = req;
    providerInstance.responds = res;
    providerInstance.urlObject = url.parse(req.url, true);
    providerInstance.components = providerInstance.fetchPathComponents();

    var isFile = providerInstance.components[providerInstance.components.length - 1].indexOf(".");

    if(isFile > -1) {

        var filePath = __dirname + "/../Resources/" + providerInstance.createPath(0);
        var lastPathComonents = providerInstance.components[providerInstance.components.length - 1]
        console.log(providerInstance.components);
        var typeObject =  providerInstance.fetchFileTypeObject(lastPathComonents);
        providerInstance.contentType = typeObject.contentType;

        providerInstance.saveOperationHandler(function(){

          fs.statSync(filePath);
          return fs.readFileSync(filePath);

        });

    } else {

      providerInstance.contentType = providerInstance.config.contentType;
      var modulPath = __dirname + "/../Services/" + providerInstance.components[0] + ".js";

      providerInstance.saveOperationHandler(function(){

        fs.statSync(modulPath);
        var params = providerInstance.components.slice(2, providerInstance.components.length);
        return providerInstance.callModul(modulPath,params);

      },{ // error object
        message : "error message hdhd",
        code: 503
      });

    }

  }).listen(config.port, config.host);

  console.log("Server wurde gestarted");

}

function loadConfigObject() {
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

exports.object = Provider;
exports.loadConfigObject = loadConfigObject;
