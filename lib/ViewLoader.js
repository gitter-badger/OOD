let __fs = require("fs");
let ViewLoaderClass = class ViewLoader {

  constructor(params) {
    this.controller = params.controller;
    this.controller.model = (!params.model) ? {} : params.model;
    this.getValueFunction = params.getValueFunction;
    this.setValueFunction = params.setValueFunction;
    this.viewFolderPath = params.viewFolderPath;
    this.viewContent = params.viewConent;
    this.orginViewContent = params.orginViewContent;
    this.viewscriptMatches = params.viewscriptMatches;
  }

  load(viewName) {

    let viewLoaderInstance = this;

    if(this.controller) {

      this.controller.provider.contentType = "text/html";

      this.controller.getValue = function(key) {
        if(!viewLoaderInstance.getValueFunction) {
          return this.model[key];
        } else {
          return viewLoaderInstance.getValueFunction(key);
        }
      };

      this.controller.setValue = function(key, value) {
        if(!viewLoaderInstance.setValueFunction) {
          this.model[key] = value;
        } else {
          viewLoaderInstance.setValueFunction(key, value);
        }
      }

      let filePath = this.viewFolderPath + "/" + viewName + ".view";

      if(__fs.existsSync(filePath)) {
         this.orginViewContent = new String(__fs.readFileSync(filePath));
         this.viewContent = this.orginViewContent;
      }

      this.findViewScripts();

    }

  }

  findViewScripts() {



    if(this.orginViewContent) {

      let regex = /<\?viewscript([\w\W][^\?]*)\?>/g;
      var match;
      this.viewscriptMatches = [];
      while ((match = regex.exec(this.orginViewContent)) !== null) {
          if (match.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          this.viewscriptMatches.push(match);
      }

    }
  }

  parse() {
    let controller = this.controller;
    if(this.viewscriptMatches) {
      if(this.orginViewContent) {
        for(let match of this.viewscriptMatches) {
           this.viewContent = this.viewContent.replace(match[0], eval(match[1]));
        }
      }
    }
  }

}

exports.class = ViewLoaderClass;
