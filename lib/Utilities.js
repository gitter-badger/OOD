let __crypto = require('crypto');

let UtilitiesClass = class Utilities {

  static isEmpty(obj) {

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;

  }

  static fetchFolderPath(fileComponents) {
    let folderPath = "";
    for(let index in fileComponents) {
      if(index != fileComponents.length -1) {
        var seperator = "";
        if(index != fileComponents.length -2) {
          seperator = "/"
        }
        folderPath += fileComponents[index] + seperator;
      }
    }
    return folderPath;
  }

  static parseAuthStringToMD5(string) {
    let components = string.split(":");
    components[1] = __crypto.createHash('md5').update(components[1]).digest('hex');
    return components.join(":");
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static parseObjectToArray(object) {

    let array = [];
    for(let key in object) {
      array.push(object[key]);
    }

    return array;

  }

  static createUUID(patternString) {

    if(!patternString) patternString = "#####################";

    let chars = "qwertzuiopasdfghjklyxcvbnm";
    let numbers = [1,2,3,4,5,6,7,8,9];
    var resultString = "";

    for(let index in patternString) {

      var char = patternString.charAt(index);
      let isUppercase = Utilities.getRandomInt(0,2);
      let isChar = Utilities.getRandomInt(0,2);


      if(char == "#") {
        if(isChar == 1) {

          var randomChar = chars[Utilities.getRandomInt(0,chars.length)];

          if(isUppercase == 1) {
            randomChar = randomChar.toUpperCase();
          }

          resultString += randomChar;

        } else {

          var randomCharInt = "";
          randomCharInt += numbers[Utilities.getRandomInt(0,numbers.length)];
          resultString += randomCharInt;
        }
      } else {
        resultString += "-";
      }
    }

    return resultString;

  }

  static md5(s) {
     return __crypto.createHash('md5').update(s).digest('hex');
  }

}

exports.class = UtilitiesClass;
