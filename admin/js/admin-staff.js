/**
 * Admin — staff approval UI
 */
var GVStaffAdmin = (function () {
  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderPending(list) {
    var box = document.getElementById("pendingStaffList");
    if (!list.length) {
      box.innerHTML = '<p class="text-muted small">No pending registrations.</p>';
      return;
    }
    var html = "";
    list.forEach(function (s) {
      html += '<div class="admin-card-item"><div class="d-flex flex-wrap justify-content-between align-items-start">' +
        '<div><strong>' + esc(s.name) + '</strong> <span class="badge badge-warning ml-1">pending</span>' +
        '<div class="small text-muted mt-1">' + esc(s.designation) + ' · ' + esc(s.campus) + '<br>' +
        'ID: <code>' + esc(s.staffId) + '</code> · ' + esc(s.email) + ' · ' + esc(s.phone) + '</div></div>' +
        '<div class="mt-2 mt-md-0">' +
        '<button class="btn btn-success btn-sm mr-1 btn-approve" data-uid="' + s.uid + '">Approve</button>' +
        '<button class="btn btn-outline-danger btn-sm btn-reject" data-uid="' + s.uid + '">Reject</button>' +
        '</div></div></div>';
    });
    box.innerHTML = html;
    box.querySelectorAll(".btn-approve").forEach(function (btn) {
      btn.onclick = function () {
        GVFirebase.updateStaffStatus(btn.getAttribute("data-uid"), "approved", (window.firebase.auth().currentUser || {}).uid)
          .then(function () { initStaffSection(); });
      };
    });
    box.querySelectorAll(".btn-reject").forEach(function (btn) {
      btn.onclick = function () {
        if (!confirm("Reject this staff registration?")) return;
        GVFirebase.updateStaffStatus(btn.getAttribute("data-uid"), "rejected", null)
          .then(function () { initStaffSection(); });
      };
    });
  }

  function renderApproved(list) {
    var box = document.getElementById("approvedStaffList");
    if (!list.length) {
      box.innerHTML = '<p class="text-muted small">No approved staff yet.</p>';
      return;
    }
    var html = '<div class="table-responsive"><table class="table table-sm table-bordered bg-white"><thead><tr>' +
      '<th>Name</th><th>Staff ID</th><th>Role</th><th>Campus</th><th></th></tr></thead><tbody>';
    list.forEach(function (s) {
      html += '<tr><td>' + esc(s.name) + '<br><small class="text-muted">' + esc(s.designation) + '</small></td>' +
        '<td><code>' + esc(s.staffId) + '</code></td>' +
        '<td><select class="form-control form-control-sm staff-role-select" data-uid="' + s.uid + '">' +
        '<option value="staff"' + (s.role === "staff" ? " selected" : "") + '>Staff</option>' +
        '<option value="admin"' + (s.role === "admin" ? " selected" : "") + '>Admin</option></select></td>' +
        '<td>' + esc(s.campus) + '</td>' +
        '<td><button class="btn btn-sm btn-outline-danger btn-revoke" data-uid="' + s.uid + '">Revoke</button></td></tr>';
    });
    html += "</tbody></table></div>";
    box.innerHTML = html;
    box.querySelectorAll(".staff-role-select").forEach(function (sel) {
      sel.onchange = function () {
        GVFirebase.setStaffRole(sel.getAttribute("data-uid"), sel.value);
      };
    });
    box.querySelectorAll(".btn-revoke").forEach(function (btn) {
      btn.onclick = function () {
        if (!confirm("Revoke access for this user?")) return;
        GVFirebase.updateStaffStatus(btn.getAttribute("data-uid"), "rejected", null)
          .then(function () { initStaffSection(); });
      };
    });
  }

  function initStaffSection() {
    return Promise.all([
      GVFirebase.listStaffByStatus("pending"),
      GVFirebase.listStaffByStatus("approved")
    ]).then(function (res) {
      renderPending(res[0]);
      renderApproved(res[1]);
    });
  }

  function showAdminNav(isAdmin) {
    document.querySelectorAll(".admin-only-nav, .admin-only-sec").forEach(function (el) {
      el.classList.toggle("d-none", !isAdmin);
    });
  }

  return { initStaffSection: initStaffSection, showAdminNav: showAdminNav };
})();
