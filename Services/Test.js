function Test() {

}
Test.prototype.showMessage = function(p1,p2) {
  return this.message + " " + p1 + " " + p2;
}

exports.object = Test;
