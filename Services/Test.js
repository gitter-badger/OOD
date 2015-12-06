
class Test {
  showMessage(p1,p2) {
    if(this.parameter) {
        return this.parameter.message + " " + p1 + " " + p2;
    } else {
      return "Hallo";
    }
  }
}

exports.class = Test;
