/**
 * Admin portal authentication & routing
 */
var GVAuth = (function () {
  function showAlert(elId, msg, type) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.className = "alert alert-" + (type || "danger");
    el.textContent = msg;
    el.classList.remove("d-none");
  }

  function firebaseErrorMessage(err) {
    if (!err) return "Request failed.";
    var code = err.code || "";
    var map = {
      "auth/email-already-in-use": "This email is already registered. Try logging in.",
      "auth/invalid-email": "Invalid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/operation-not-allowed": "Email/password sign-in is disabled in Firebase. Enable it under Authentication → Sign-in method.",
      "auth/network-request-failed": "Network error. Check your internet connection.",
      "permission-denied": "Firestore permission denied. Run: firebase deploy --only firestore:rules"
    };
    return map[code] || err.message || String(err);
  }

  function routeAfterAuth(profile) {
    if (profile.status === "pending") {
      window.location.href = "pending.html";
      return;
    }
    if (profile.status !== "approved") {
      window.location.href = "login.html";
      return;
    }
    window.location.href = "dashboard.html";
  }

  function initLoginPage() {
    if (!GVFirebase.isConfigured()) {
      showAlert("loginAlert", "Configure ../js/firebase-config.js first. See FIREBASE_SETUP.md.");
      document.getElementById("loginForm").querySelector("button").disabled = true;
      return;
    }
    GVFirebase.onAuthChanged(function (user) {
      if (!user) return;
      GVFirebase.getStaffProfile(user.uid).then(function (p) {
        if (p) routeAfterAuth(p);
      });
    });
    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = document.getElementById("loginBtn");
      var alert = document.getElementById("loginAlert");
      alert.classList.add("d-none");
      btn.disabled = true;
      GVFirebase.signIn(
        document.getElementById("loginId").value.trim(),
        document.getElementById("loginPassword").value
      ).then(function () {
        return GVFirebase.requireApprovedUser();
      }).then(function () {
        window.location.href = "dashboard.html";
      }).catch(function (err) {
        if (err.message === "pending") {
          window.location.href = "pending.html";
          return;
        }
        showAlert("loginAlert", firebaseErrorMessage(err));
        btn.disabled = false;
      });
    });
  }

  function initSignupPage() {
    if (!GVFirebase.isConfigured()) {
      showAlert("signupAlert", "Firebase not configured.", "warning");
      return;
    }
    document.getElementById("signupForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = document.getElementById("suPassword").value;
      var pw2 = document.getElementById("suPassword2").value;
      if (pw !== pw2) {
        showAlert("signupAlert", "Passwords do not match.", "danger");
        return;
      }
      if (!document.getElementById("suDesignation").value) {
        showAlert("signupAlert", "Please select a designation.", "warning");
        return;
      }
      var btn = document.getElementById("signupBtn");
      var btnHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i>Submitting…';
      var alertEl = document.getElementById("signupAlert");
      alertEl.classList.add("d-none");
      try {
        GVFirebase.signUpStaff({
          name: document.getElementById("suName").value.trim(),
          staffId: document.getElementById("suStaffId").value.trim(),
          email: document.getElementById("suEmail").value.trim(),
          phone: document.getElementById("suPhone").value.trim(),
          designation: document.getElementById("suDesignation").value,
          department: document.getElementById("suDepartment").value.trim(),
          campus: document.getElementById("suCampus").value,
          password: pw
        }).then(function (res) {
          var el = document.getElementById("signupAlert");
          if (res.profile.status === "approved") {
            el.className = "alert alert-success";
            el.innerHTML = "<strong>Account created.</strong> You are an administrator. Redirecting…";
            el.classList.remove("d-none");
            setTimeout(function () { window.location.href = "dashboard.html"; }, 1500);
          } else {
            el.className = "alert alert-success";
            el.innerHTML = "<strong>Registration submitted.</strong> Wait for admin approval, then login with your Staff ID or email.";
            el.classList.remove("d-none");
            btn.disabled = false;
            setTimeout(function () { window.location.href = "pending.html"; }, 2500);
          }
        }).catch(function (err) {
          showAlert("signupAlert", firebaseErrorMessage(err), "danger");
          btn.disabled = false;
          btn.innerHTML = btnHtml;
        });
      } catch (err) {
        showAlert("signupAlert", firebaseErrorMessage(err), "danger");
        btn.disabled = false;
        btn.innerHTML = btnHtml;
      }
    });
  }

  function initPendingPage() {
    if (!GVFirebase.isConfigured()) return;
    GVFirebase.onAuthChanged(function (user) {
      if (!user) {
        window.location.href = "login.html";
        return;
      }
      GVFirebase.getStaffProfile(user.uid).then(function (p) {
        if (p && p.status === "approved") {
          window.location.href = "dashboard.html";
          return;
        }
        if (p) {
          document.getElementById("pendingEmail").textContent = "Registered as: " + p.name + " (" + p.staffId + ")";
        }
      });
    });
    document.getElementById("btnPendingLogout").onclick = function () {
      GVFirebase.signOut().then(function () { window.location.replace("index.html"); });
    };
  }

  function guardDashboard(cb) {
    if (!GVFirebase.isConfigured()) {
      alert("Configure ../js/firebase-config.js");
      window.location.href = "index.html";
      return;
    }
    GVFirebase.onAuthChanged(function (user) {
      if (!user) {
        window.location.href = "login.html";
        return;
      }
      user.getIdTokenResult(true).then(function (idTokenResult) {
        var claims = (idTokenResult && idTokenResult.claims) || {};
        var role = claims.role;
        var approved = claims.approved;

        var isSuperAdmin = (role === "super_admin") || GVFirebase.isSuperAdminEmail(user.email);

        if (isSuperAdmin || (role === "staff_admin" && approved === true)) {
          GVFirebase.getStaffProfile(user.uid).then(function (profile) {
            var prof = Object.assign({}, profile || {
              name: user.displayName || "Admin",
              email: user.email,
              staffId: "SA",
              status: "approved"
            });
            prof.role = isSuperAdmin ? "super_admin" : (role || (profile && profile.role) || "staff_admin");
            cb({ user: user, profile: prof });
          });
        } else if (role === "staff_admin" && approved === false) {
          window.location.href = "pending.html";
        } else {
          // Fallback: check Firestore staff profile if custom token claims are absent
          GVFirebase.getStaffProfile(user.uid).then(function (profile) {
            if (profile && profile.status === "approved") {
              var prof = Object.assign({}, profile);
              if (GVFirebase.isSuperAdminEmail(user.email)) prof.role = "super_admin";
              else if (!prof.role) prof.role = "staff_admin";
              cb({ user: user, profile: prof });
            } else if (profile && profile.status === "pending") {
              window.location.href = "pending.html";
            } else {
              GVFirebase.signOut().then(function () {
                window.location.href = "login.html";
              });
            }
          }).catch(function () {
            GVFirebase.signOut().then(function () {
              window.location.href = "login.html";
            });
          });
        }
      }).catch(function (err) {
        console.error("Dashboard guard error:", err);
        window.location.href = "login.html";
      });
    });
  }

  return {
    initLoginPage: initLoginPage,
    initSignupPage: initSignupPage,
    initPendingPage: initPendingPage,
    guardDashboard: guardDashboard
  };
})();
