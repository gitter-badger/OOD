
let __fs = require("fs");

let ObjectSaverClass = class ObjectSaver {

  constructor(folderPath, fileEncoding) {
    this.folderPath = folderPath;
    this.fileEncoding = fileEncoding;
  }

  save(objectName, object) {
    if(__fs.existsSync(this.folderPath)) {
      let filePath = this.folderPath + "/" + objectName + ".json";
      __fs.writeFileSync(filePath, JSON.stringify(object), this.fileEncoding);
    } else {
      throw new Error("Folder ist not existing");
    }

  }

  load(objectName) {

    var filePath = this.folderPath + "/" + objectName + ".json";

    if(__fs.existsSync(filePath)) {
      
      let fileContentData = __fs.readFileSync(filePath, this.fileEncoding);
      let jsonObject = JSON.parse(fileContentData);

      if(jsonObject != undefined && jsonObject != null) {
        return jsonObject;
      }
    }

    return null;

  }

}

exports.class = ObjectSaverClass;
