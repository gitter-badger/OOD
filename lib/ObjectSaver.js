
let __fs = require("fs");

let ObjectSaverClass = class ObjectSaver {

  constructor(folderPath, fileEncoding) {
    this.folderPath = folderPath;
    this.fileEncoding = fileEncoding;
  }

  save(objectName, object, callback) {

    if(__fs.existsSync(this.folderPath)) {
      let filePath = this.folderPath + "/" + objectName + ".json";
      __fs.writeFile(filePath, JSON.stringify(object), this.fileEncoding,callback);
    } else {
      throw new Error("Folder ist not existing");
    }

  }

  load(objectName) {

    var filePath = this.folderPath + "/" + objectName + ".json";

    if(__fs.existsSync(filePath)) {

      let fileContentData = __fs.readFileSync(filePath, this.fileEncoding);
    
      let jsonObject;

      try {
        jsonObject = JSON.parse(fileContentData);
      } catch (e) {

      }

      if(jsonObject) {
        return jsonObject;
      }

    }

    return null;

  }

}

exports.class = ObjectSaverClass;
