/**
 * Staff Admin Route Guard
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
      var approved = claims.approved;
      
      // Allow super_admin
      if (role === "super_admin") {
        return;
      }
      
      // Allow approved staff_admin
      if (role === "staff_admin") {
        if (approved === true) {
          return;
        } else {
          console.warn("Staff Admin account not approved.");
          window.location.replace("pending.html");
          return;
        }
      }
      
      // If user has no valid roles (or custom claims are not yet set)
      console.warn("Access denied. No valid claims found:", role, approved);
      window.location.replace("login.html");
    }).catch(function (err) {
      console.error("Staff Admin Guard validation failed:", err);
      window.location.replace("login.html");
    });
  });
})();
