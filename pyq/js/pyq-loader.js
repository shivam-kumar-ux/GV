/**
 * Loads PYQ Hub content from Firestore (live) or static pyq-default.js fallback.
 */
(function (global) {
  function normalizePaper(p) {
    return {
      title: p.title || "",
      year: String(p.year || ""),
      class: String(p.class || ""),
      subject: p.subject || "",
      exam: p.exam || "",
      view: p.view || p.viewUrl || "#",
      download: p.download || p.downloadUrl || "#"
    };
  }

  function applyContent(raw) {
    var c = raw || global.GV_PYQ_DEFAULT_CONTENT || { papers: [], examDetails: {}, exams: [] };
    global.GV_PYQ_CONTENT = c;
    global.PYQ_DATA = (c.papers || []).map(normalizePaper);
    global.EXAM_DETAILS_DATA = c.examDetails || {};
    if (typeof global.gvPyqApplyContent === "function") {
      global.gvPyqApplyContent(c);
    }
    return c;
  }

  function loadContent() {
    applyContent(global.GV_PYQ_DEFAULT_CONTENT);
    if (global.GVFirebase && global.GVFirebase.isConfigured && global.GVFirebase.isConfigured()) {
      global.GV_SITE_ID = "pyq";
      return global.GVFirebase.loadSiteContent("pyq").then(function (c) {
        applyContent(c);
        global.GV_PYQ_SOURCE = global.GV_CONTENT_SOURCE || "firebase";
        return c;
      }).catch(function () {
        global.GV_PYQ_SOURCE = "default";
        return global.GV_PYQ_CONTENT;
      });
    }
    global.GV_PYQ_SOURCE = "default";
    return Promise.resolve(global.GV_PYQ_CONTENT);
  }

  global.GV_PYQ_READY = loadContent();

  global.GVPyqLoader = {
    apply: applyContent,
    reload: loadContent,
    getPapers: function () { return global.PYQ_DATA; }
  };
})(window);
