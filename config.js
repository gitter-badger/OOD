
var config = {

  port : 8080,
  host: '127.0.0.1',
  contentType: "text/plain",
  servicesPath: __dirname + "/Services/",
  resourcesPath: __dirname + "/Resources/",
  errorContentType: "text/plain",
  viewFolderPath: "/home/marius/Documents/Programming/Projects/JS/OOD/Views",
  indexTypes: [
    "html"
  ],
  session: {
    sessionFolderPath: "/home/marius/Documents/Programming/Projects/JS/OOD/sessionfiles",
    cookieExpire: "",
    sessionExpire: "60000 * 5",
    fileEncoding: "utf8",
    cleanerInterval: "600",
    isFileSaving: false
  },
  extensionRules: {

    txt: {
      contentType : "text/plain"
    },

    html: {
      contentType : "text/html"
    },

    css: {
      contentType: "text/css"
    },

    ico: {
      contentType: "image/x-icon"
    },

    png: {
      contentType: "image/png"
    }

  }
}

exports.object = config;
