'use strict'

var CryptoJS = require("crypto-js");

module.exports = function () {
  var user = localStorage.getItem('loggedOnUser');
  user = JSON.parse(user);

  /* --------- Mocked User session details ----------- */
  // TODO: remove once login service has been implemented
  //Get Time diff
  var timeDiff = 0;
  var user = {
    email: 'sysadmin@jembi.org',
    // default password: sysadmin
    passwordHash: '4956a991e772edd0576e62eae92f9c94fc693a2d0ee07f8f46ccce9c343d0836304f4de2ea64a41932fe0a6adc83d853a964fb785930fb4293fef8ee37448ac8',
    salt: '08f3a235-8660-49e9-93c3-5d4655b98c83',
    type: 'sysadmin',
    timeDiff: timeDiff
  }

  return {
    'setLoggedInUser': function (u) {
      user = u;
      localStorage.setItem('loggedOnUser', JSON.stringify( user ));
    },
    'getLoggedInUser': function() {
      var user = localStorage.getItem('loggedOnUser');
      user = JSON.parse(user);
      return user;
    },
    'request': function (config) {
      if (user) {
        var passwordhash = user.passwordHash;
        var requestSalt = CryptoJS.lib.WordArray.random(16).toString();
        var requestTS = new Date().toISOString();
        try {
          /**
           * Try and syncronize with server time
           *
           */
          requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString();
        } catch (e) {
          console.log('Authinterceptor: ' + e.message);
        }
        var username = user.email;

        try {
          /**
           * Try and syncronize with server time
           *
           */
          requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString();
        } catch (e) {
          console.log('Authinterceptor: ' + e.message);
        }

        var sha512 = CryptoJS.algo.SHA512.create();
        sha512.update(passwordhash);
        sha512.update(requestSalt);
        sha512.update(requestTS);
        var hash = sha512.finalize();

        config.headers['auth-username'] = username;
        config.headers['auth-ts'] = requestTS;
        config.headers['auth-salt'] = requestSalt;
        config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex);
      }

      return config;
    }
  };
}
