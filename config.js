
var config = {
  
  port : 8080,
  host: '127.0.0.1',
  contentType: "text/plain",
  errorContentType: "text/plain",

  extensionRules: {

    txt: {
      contentType : "text/plain"
    },

    html: {
      contentType : "text/html"
    },

    css: {
      contentType: "text/css"
    }

  }
}

exports.object = config;
