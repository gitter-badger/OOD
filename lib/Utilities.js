class Utilities {

  static isEmpty(obj) {

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;

  }

}

exports.class = Utilities;
