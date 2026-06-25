/**
 * Pending Approval Page Logic & Polling Guard
 */
(function () {
  function checkStatus() {
    var user = firebase.auth().currentUser;
    if (!user) return;
    
    // Force refresh token to get updated claims
    user.getIdTokenResult(true).then(function (idTokenResult) {
      var claims = idTokenResult.claims;
      var role = claims.role;
      var approved = claims.approved;
      
      if (role === "super_admin" || (role === "staff_admin" && approved === true)) {
        console.log("Account approved! Redirecting to dashboard...");
        window.location.replace("dashboard.html");
      }
    }).catch(function (err) {
      console.error("Error polling approval status:", err);
    });
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      window.location.replace("login.html");
      return;
    }
    
    var emailEl = document.getElementById("pendingEmail");
    if (emailEl) {
      emailEl.textContent = "Registered Email: " + user.email;
    }

    var msgEl = document.getElementById("pendingMsg");
    if (msgEl) {
      msgEl.textContent = "Your account is under review by Super Admin. You will be redirected once approved.";
    }
    
    // Run status check immediately
    checkStatus();
    
    // Poll every 30 seconds
    var pollInterval = setInterval(checkStatus, 30000);
    
    // Sign out functionality
    var logoutBtn = document.getElementById("btnPendingLogout");
    if (logoutBtn) {
      logoutBtn.onclick = function () {
        clearInterval(pollInterval);
        GVFirebase.signOut().then(function () {
          window.location.replace("login.html");
        });
      };
    }
  });
})();
