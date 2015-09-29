var sqlite = require("sqlite3");
var fs = require("fs");

function Database(dbName, dbPath) {

  this.dbName = dbName;
  this.dbPath = dbPath;
  this.sqlite;

  function createSqliteDatabase() {

  }

}

Database.prototype.fetch = function(modelName) {

}

Database.prototype.save = function(modelName, model) {

}

Database.prototype.parseObject = function(jsonString) {
  var jsonObject = JSON.parse(jsonString);
  return jsonObject;
}
