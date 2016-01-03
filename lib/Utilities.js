
let UtilitiesClass = class Utilities {

  static isEmpty(obj) {

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;

  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static createUUID(patternString) {

    if(patternString == undefined || patternString == null) patternString = "######-###-######-###";

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

}

exports.class = UtilitiesClass;
