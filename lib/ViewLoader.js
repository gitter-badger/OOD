let __fs = require("fs");
let ViewLoaderClass = class ViewLoader {

  constructor(controller, viewFolderPath, model, getValueFunction, setValueFunction) {
    this.controller = controller;
    this.controller.model = (model == undefined || model == null) ? {} : model;
    this.getValueFunction = getValueFunction;
    this.setValueFunction = setValueFunction;
    this.viewFolderPath = viewFolderPath;
    this.viewContent = null;
    this.orginViewContent = null;
    this.viewscriptMatches = null;
  }

  load(viewName) {

    let viewLoaderInstance = this;

    if(this.controller != null && this.controller != undefined) {

      this.controller.provider.contentType = "text/html";

      this.controller.getValue = function(key) {
        if(viewLoaderInstance.getValueFunction == null || viewLoaderInstance.getValueFunction == undefined) {
          return this.model[key];
        } else {
          return viewLoaderInstance.getValueFunction(key);
        }
      };

      this.controller.setValue = function(key, value) {
        if(viewLoaderInstance.setValueFunction == null || viewLoaderInstance.setValueFunction == undefined) {
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



    if(this.orginViewContent != null && this.orginViewContent != undefined) {

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
    if(this.viewscriptMatches != null && this.viewscriptMatches != undefined) {
      if(this.orginViewContent != null && this.orginViewContent != undefined) {
        for(let match of this.viewscriptMatches) {
           this.viewContent = this.viewContent.replace(match[0], eval(match[1]));
        }
      }
    }
  }

}

exports.class = ViewLoaderClass;
