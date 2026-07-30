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
      var claims = (idTokenResult && idTokenResult.claims) || {};
      var role = claims.role;
      var approved = claims.approved;
      
      // Allow super_admin by custom claim OR super admin email
      if (role === "super_admin" || (window.GVFirebase && window.GVFirebase.isSuperAdminEmail(user.email))) {
        return;
      }
      
      // Allow approved staff_admin claim
      if (role === "staff_admin") {
        if (approved === true) {
          return;
        } else {
          console.warn("Staff Admin account not approved.");
          window.location.replace("pending.html");
          return;
        }
      }
      
      // Fallback: check Firestore staff profile if custom claims are missing
      if (window.GVFirebase) {
        window.GVFirebase.getStaffProfile(user.uid).then(function (profile) {
          if (profile && profile.status === "approved") {
            return; // Authorized via Firestore profile
          }
          if (profile && profile.status === "pending") {
            console.warn("Staff account is pending approval.");
            window.location.replace("pending.html");
            return;
          }
          console.warn("Access denied. Profile not approved:", profile);
          window.location.replace("login.html");
        }).catch(function (err) {
          console.error("Staff Admin Guard profile lookup failed:", err);
          window.location.replace("login.html");
        });
        return;
      }

      // If user has no valid roles or profile
      console.warn("Access denied. No valid claims found:", role, approved);
      window.location.replace("login.html");
    }).catch(function (err) {
      console.error("Staff Admin Guard validation failed:", err);
      window.location.replace("login.html");
    });
  });
})();
