/**
 * Super Admin Route Guard
 */
(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      window.location.replace("login.html");
      return;
    }
    
    // Force refresh token to get current custom claims
    user.getIdTokenResult(true).then(function (idTokenResult) {
      var claims = idTokenResult.claims;
      var role = claims.role;
      
      if (role !== "super_admin") {
        console.warn("Access denied. Required 'super_admin' claim, got:", role);
        window.location.replace("unauthorized.html");
      }
    }).catch(function (err) {
      console.error("Super Admin Guard validation failed:", err);
      window.location.replace("login.html");
    });
  });
})();
