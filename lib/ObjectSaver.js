
let __fs = require("fs");

class ObjectSaver {

  constructor(folderPath, fileEncoding) {
    this.folderPath = folderPath;
    this.fileEncoding = fileEncoding;
  }

  save(objectName, object) {
    return __fs.writeFileSync(this.folderPath + "/" + objectName + ".json", JSON.stringify(object), this.fileEncoding);
  }

  load(objectName) {

    let fileContentData = __fs.readFileSync(this.folderPath + "/" + objectName + ".json",this.fileEncoding);
    let jsonObject = JSON.parse(fileContentData);

    if(jsonObject != undefined && jsonObject != null) {
      return jsonObject;
    }

    return jsonObject;

  }

}

exports.class = ObjectSaver;
