
let __utilities = require(__dirname + "/Utilities.js");
let __fs = require("fs");

let HTTPAuthClass = class HTTPAuth {
  constructor(params) {
    this.request = params.request;
    this.responds = params.responds;
    this.realm = params.realm;
    this.message = params.message;
    this.authType = params.authType;
    this.nonces = (params.nonces) ? params.nonces : {};
  }

  login(path, serviceName) {

    let folderPath = path;
    path = (serviceName) ? path + serviceName + ".htpasswd" : path + "/" + "users.htpasswd";

    if(__fs.existsSync(path)) {

      let auth = this.request.headers['authorization'];

      if(auth) {
        console.log("auth is okay");
        var users;
        users = __fs.readFileSync(path,"ascii");
        users = users.split("\n");

        let tmp = auth.split(' ');
        let buf = new Buffer(tmp[1], 'base64');
        var clientUser = buf.toString("ascii");

        var foundedUser = false;

        for(let user of users) {
          let serverUser = user.trim();

          if(this.isAuthType("BASIC")) {
            if(clientUser == user.trim()) {
              foundedUser = true;
              break;
            }
          } else {
            if(this.digestCompare(user.trim())) {
              foundedUser = true;
              break;
            }
          }

        }

        if(!foundedUser) {
          this.auth401(folderPath, this.message);
        }

        return foundedUser;

      } else {
        this.auth401(folderPath, this.message);
        return false;
      }
    } else {
      return true;
    }
  }

  digestCompare(userString) {

    let authComponents = this.fetchComponents();

    let user = userString.split(":");
    let username = user[0];
    let password = user[1];

    console.log("authComponents == " + JSON.stringify(authComponents));

    let a1 = __utilities.class.md5(username + ":" + this.realm + ":" + password);
    let a2 = __utilities.class.md5(this.request.method + ":" + authComponents.uri);
    let hash = __utilities.class.md5(a1 + ":" + authComponents.nonce + ":" + authComponents.nc + ":" + authComponents.cnonce + ":" + authComponents.qop + ":" + a2);

    console.log("if " + hash + " == " + authComponents.response);
    if(hash == authComponents.response) {
      return true;
    }

    return false;
  }

  fetchComponents() {

    var components = {
         'username': null,
         'realm':    null,
         'nonce':    null,
         'uri':      null,
         'response': null,
         'qop':      null,
         'nc':       null,
         'cnonce':   null
    };

    for (var k in components) {
         // First check for ""
         var val = new RegExp(k+'="([^"]*)"').exec(this.request.headers.authorization);

         if (val == null) {
           // Some values are enclosed in ""
           val = new RegExp(k+'=([^,]*)').exec(this.request.headers.authorization);
         }

         if ((val == null) || (!val[1])) {
           // We need all parts.
           return false;
         }

         components[k] = val[1];
      }

      return components;

    }

    isAuthType(s) {

      if(this.authType.toUpperCase() == s.toUpperCase()) {
        console.log("AUTH " + s + " check");
        return true;
      }

      if(!s && s.toUpperCase() == "BASIC") {
        return true;
      }

      return false;

  }

  auth401(uri, message) {

    var authString;

    if(this.isAuthType("BASIC")) {
      authString = 'Basic realm="'+this.realm+'",uri="' + uri + '"';
    } else {
      let opaque = __utilities.class.md5(this.realm+this.request.headers['user-agent']+this.request.connection.remoteAddress);
      authString = 'Digest realm="'+this.realm+'",qop="auth",opaque="'+opaque+'"' + ',uri="' + uri + '"';
    }

    if(authString) {

      this.responds.writeHead(401, {
        'Content-Type': 'text/html',
        'WWW-Authenticate': authString
      });

      this.responds.end('<html><body>' + message + '</body></html>');
    }
  }


}

exports.class = HTTPAuthClass;
