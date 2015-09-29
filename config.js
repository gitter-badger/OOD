
var config = {
  port : 8080,
  host: '127.0.0.1',
  contentType: "text/plain",
  errorContentType: "text/plain",
  objectRules:[
  "filemanger"
  ],
  documentRules: [
  ""
  ],
  extensionRules: {
    txt: {
      contentType : "text/plain"
    }
  }
}

exports.object = config;
