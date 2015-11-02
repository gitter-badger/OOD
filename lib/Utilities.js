function Utilities() {
  this.isEmpty = function(obj) {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }

      return true;
  }
}

exports.object = Utilities;
