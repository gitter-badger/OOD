
var config = {

  port : 8080,
  host: '127.0.0.1',
  contentType: "text/plain",
  servicesPath: __dirname + "/Services/",
  resourcesPath: __dirname + "/Resources/",
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
