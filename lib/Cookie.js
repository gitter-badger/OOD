class Cookie {

  constructor(name, value, expire) {
    this.name = name;
    this.value = value;
    this.expire = expire;
  }

  createHTTPParam() {
    return "Set-Cookie:" + "name=" + this.name" +
  }

  
}
