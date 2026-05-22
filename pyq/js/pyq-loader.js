/**
 * Loads PYQ Hub content from static file (Phase 6) or Firestore merge.
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
    return c;
  }

  applyContent(global.GV_PYQ_DEFAULT_CONTENT);

  global.GV_PYQ_READY = Promise.resolve(global.GV_PYQ_CONTENT);

  global.GVPyqLoader = {
    apply: applyContent,
    getPapers: function () { return global.PYQ_DATA; }
  };
})(window);
