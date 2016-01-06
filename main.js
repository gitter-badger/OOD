

var params = {
  "--config_path": null,
  "--help": null
};

var isStarting = false

process.argv.forEach(function (val, index, array) {
  if(val == "--config_path") {
    params["--configPath"] = array[index + 1];
  } else if(val == "--help") {
    isStarting = true
    params["--config_path"] = "set the config path: --config_path $yourPath"
    params["--help"] = "show this message"
    console.log(params);
  }
});

function main(params) {
  let provider = require(__dirname + "/lib/Provider.js");
  let configObject = provider.class.loadConfigObject(params["config_path"]);
  if(configObject) {
    let providerObject = new provider.class(configObject);
    providerObject.start();
  }
}

if(!isStarting)main(params);
