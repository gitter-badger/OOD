
let provider = require(__dirname + "/lib/Provider.js");
let providerObject = new provider.class(provider.class.loadConfigObject());
providerObject.start();
