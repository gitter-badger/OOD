class CookieValue {
  constructor(key, value) {
    protected this.key = key;
    protected this.value = value;
  }

  get key() {
    return this.key;
  }

  get value() {
    return this.value;
  }

  toString() {
    return this.key + "=" + this.value;
  }
}

exports.class = CookieValue;
