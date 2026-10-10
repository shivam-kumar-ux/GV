/**
 * GV Dark / Light Mode Toggle
 * Persists preference in localStorage.
 * Applies data-theme="dark" on <html> element.
 * Works for both the public site and the admin panel.
 */
(function () {
  var KEY = "gv-theme";
  var DARK = "dark";
  var LIGHT = "light";

  /* ── Apply theme immediately (before paint) to avoid flash ── */
  var saved = localStorage.getItem(KEY);
  if (saved === DARK) {
    document.documentElement.setAttribute("data-theme", DARK);
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === DARK ? DARK : LIGHT;
  }

  function setTheme(theme) {
    if (theme === DARK) {
      document.documentElement.setAttribute("data-theme", DARK);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem(KEY, theme);
    updateAllButtons();
  }

  function toggle() {
    setTheme(getTheme() === DARK ? LIGHT : DARK);
  }

  function updateAllButtons() {
    var isDark = getTheme() === DARK;
    var btns = document.querySelectorAll(".gv-theme-btn");
    btns.forEach(function (btn) {
      var icon = btn.querySelector("i");
      if (!icon) return;
      if (isDark) {
        icon.className = "fa fa-sun";
        btn.setAttribute("title", "Switch to Light Mode");
        btn.setAttribute("aria-label", "Switch to Light Mode");
      } else {
        icon.className = "fa fa-moon";
        btn.setAttribute("title", "Switch to Dark Mode");
        btn.setAttribute("aria-label", "Switch to Dark Mode");
      }
    });
  }

  /* ── Init all buttons on DOMContentLoaded ── */
  document.addEventListener("DOMContentLoaded", function () {
    updateAllButtons();
    document.querySelectorAll(".gv-theme-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggle();
      });
    });
  });

  /* ── Expose globally so admin JS can also call it ── */
  window.GVTheme = { toggle: toggle, setTheme: setTheme, getTheme: getTheme };
})();
