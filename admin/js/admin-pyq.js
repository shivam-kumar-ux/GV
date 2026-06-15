/**
 * PYQ Hub — admin editor (exams + question papers)
 */
var GVPyqAdmin = (function () {
  var content = null;
  var toastFn = function () { };

  var EXAM_PRESETS = [
    "Sainik School", "Navodaya", "JEE", "NEET", "CBSE", "NDA", "CDS",
    "BHU", "Simultala", "Ram Krishan Mission", "CUET", "RIMC", "Olympiads"
  ];

  function uid() {
    return "pyq_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  }

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o || {}));
  }

  function ensureShape() {
    if (!content.papers) content.papers = [];
    if (!content.examDetails) content.examDetails = {};
    if (!content.exams) content.exams = [];
  }

  function examNames() {
    ensureShape();
    var fromExams = content.exams.filter(function (e) { return e.active !== false; }).map(function (e) { return e.name; });
    var fromPapers = content.papers.map(function (p) { return p.exam; });
    var set = {};
    fromExams.concat(fromPapers).forEach(function (n) {
      if (n) set[n] = true;
    });
    return Object.keys(set).sort();
  }

  function fileInputHtml(pid, accept) {
    // Keep the upload markup consistent with Shahpur admin so the progress animation always binds.
    return '<div class="d-flex align-items-center mt-1">' +
      '<input type="file" class="form-control-file gv-file pyq-file" data-pid="' + pid + '" accept="' + (accept || "application/pdf") + '">' +
      '<button type="button" class="btn btn-sm btn-primary ml-2 btn-pyq-upload" disabled style="white-space: nowrap;">Upload</button>' +
      '</div>' +
      '<div class="gv-upload-progress pyq-progress d-none mt-2" style="height:18px;background:#e9ecef;border-radius:9px;overflow:hidden;position:relative;">' +
      '<div class="gv-upload-progress-bar pyq-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#2878EB,#56CCF2);border-radius:9px;transition:width 0.3s ease;"></div>' +
      '<span class="gv-upload-pct-label pyq-pct-label" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:10px;font-weight:700;color:#333;white-space:nowrap;pointer-events:none;">0%</span>' +
      '</div>';
  }


  function bindUploads(root) {
    if (!root) return;
    root.querySelectorAll(".pyq-file").forEach(function (inp) {
      var parent = inp.parentElement;
      var btn = parent ? parent.querySelector(".btn-pyq-upload") : null;
      var progressBar = parent && parent.nextElementSibling && parent.nextElementSibling.classList.contains("pyq-progress") ? parent.nextElementSibling : null;
      var barInner = progressBar ? progressBar.querySelector(".pyq-progress-bar") : null;
      var pctLabel = progressBar ? progressBar.querySelector(".pyq-pct-label") : null;

      if (!btn) {
        var containerDiv = inp.closest(".col-md-6, .admin-card-item");
        btn = containerDiv ? containerDiv.querySelector(".btn-pyq-upload") : null;
        progressBar = containerDiv ? containerDiv.querySelector(".pyq-progress") : null;
        barInner = containerDiv ? containerDiv.querySelector(".pyq-progress-bar") : null;
        pctLabel = containerDiv ? containerDiv.querySelector(".pyq-pct-label") : null;
      }

      inp.onchange = function () {
        if (btn) btn.disabled = !inp.files[0];
      };

      if (btn) {
        btn.onclick = function () {
          var file = inp.files[0];
          if (!file) return;
          var pid = inp.getAttribute("data-pid");
          var targetView = document.getElementById("pp-view-" + pid);
          var targetDl = document.getElementById("pp-dl-" + pid);
          inp.disabled = true;
          btn.disabled = true;

          if (progressBar) progressBar.classList.remove("d-none");
          if (barInner) {
            barInner.style.width = "2%";
            barInner.style.background = "linear-gradient(90deg,#2878EB,#56CCF2)";
          }
          if (pctLabel) pctLabel.textContent = "Starting…";

          var onProgress = function (percent) {
            var p = Math.round(percent);
            if (barInner) barInner.style.width = p + "%";
            if (pctLabel) pctLabel.textContent = p < 100 ? p + "%" : "Processing…";
          };

          GVFirebase.uploadFile(file, inp.getAttribute("data-folder") || "papers", "pyq", onProgress).then(function (url) {
            if (targetView) {
              targetView.value = url;
              targetView.dispatchEvent(new Event("input", { bubbles: true }));
              targetView.dispatchEvent(new Event("change", { bubbles: true }));
            }
            if (targetDl) {
              targetDl.value = url;
              targetDl.dispatchEvent(new Event("input", { bubbles: true }));
              targetDl.dispatchEvent(new Event("change", { bubbles: true }));
            }
            syncPapersFromForm();
            if (barInner) barInner.style.width = "98%";
            if (pctLabel) pctLabel.textContent = "Saving…";
            return GVFirebase.saveSiteContent(getContent(), "pyq");
          }).then(function () {
            if (barInner) { barInner.style.width = "100%"; barInner.style.background = "linear-gradient(90deg,#28a745,#56d364)"; }
            if (pctLabel) pctLabel.textContent = "Done ✓";
            toastFn("PDF uploaded. View/Download URLs saved to PYQ Hub.");
          }).catch(function (e) {
            console.error("PYQ upload error:", e);
            if (barInner) { barInner.style.width = "100%"; barInner.style.background = "linear-gradient(90deg,#dc3545,#ff7b72)"; }
            if (pctLabel) pctLabel.textContent = "Failed";
            toastFn((e && e.message) || "Upload failed", "danger");
          }).finally(function () {
            inp.disabled = false;
            btn.disabled = false;
            setTimeout(function () {
              if (progressBar) progressBar.classList.add("d-none");
              if (barInner) { barInner.style.width = "0%"; barInner.style.background = "linear-gradient(90deg,#2878EB,#56CCF2)"; }
              if (pctLabel) pctLabel.textContent = "0%";
            }, 3000);
          });
        };
      }
    });
  }

  function renderOverview() {
    ensureShape();
    var el = document.getElementById("pyqStats");
    if (!el) return;
    el.innerHTML =
      '<div class="col-md-4"><div class="p-3 rounded bg-white border"><strong>' + content.papers.length + '</strong><br><span class="small text-muted">Question papers</span></div></div>' +
      '<div class="col-md-4"><div class="p-3 rounded bg-white border"><strong>' + content.exams.length + '</strong><br><span class="small text-muted">Exam categories</span></div></div>' +
      '<div class="col-md-4"><div class="p-3 rounded bg-white border"><strong>' + examNames().length + '</strong><br><span class="small text-muted">Active exam names</span></div></div>';
  }

  function renderExams() {
    ensureShape();
    var box = document.getElementById("pyqExamsList");
    if (!box) return;
    box.innerHTML = "";
    content.exams.forEach(function (ex, idx) {
      var details = content.examDetails[ex.name] || {};
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>' + (ex.name || "Exam") + '</strong>' +
        '<button type="button" class="btn btn-sm btn-gv-danger pyq-del-exam" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-4"><label>Exam name *</label><input class="form-control ex-name" value="' + esc(ex.name) + '"></div>' +
        '<div class="col-md-2"><label>Emoji</label><input class="form-control ex-emoji" value="' + esc(details.emoji || "") + '"></div>' +
        '<div class="col-md-4"><label>Subtitle</label><input class="form-control ex-sub" value="' + esc(details.subtitle || "") + '"></div>' +
        '<div class="col-md-2"><label><input type="checkbox" class="ex-active" ' + (ex.active !== false ? "checked" : "") + '> Active</label></div>' +
        '</div>' +
        '<div class="form-group mt-2"><label>Exam Details (No HTML)</label><textarea class="form-control ex-format" rows="4" placeholder="Enter details (use • or - for lists)">' + esc(htmlToPlain(details.format || "")) + '</textarea></div>';
      box.appendChild(div);
    });
    box.querySelectorAll(".pyq-del-exam").forEach(function (btn) {
      btn.onclick = function () {
        syncExamsFromForm();
        var removed = content.exams.splice(+btn.getAttribute("data-i"), 1)[0];
        if (removed && content.examDetails[removed.name]) delete content.examDetails[removed.name];
        renderExams();
        renderOverview();
      };
    });
    box.querySelectorAll("input,textarea").forEach(function (el) {
      el.oninput = el.onchange = function () { syncExamsFromForm(); renderOverview(); };
    });
  }

  function syncExamsFromForm() {
    ensureShape();
    var list = [];
    document.querySelectorAll("#pyqExamsList .admin-card-item").forEach(function (card) {
      var name = card.querySelector(".ex-name").value.trim();
      if (!name) return;
      list.push({ name: name, active: card.querySelector(".ex-active").checked });
      if (!content.examDetails) content.examDetails = {};
      content.examDetails[name] = {
        emoji: card.querySelector(".ex-emoji").value.trim(),
        subtitle: card.querySelector(".ex-sub").value.trim(),
        format: plainToHtml(card.querySelector(".ex-format").value),
        syllabus: (content.examDetails[name] && content.examDetails[name].syllabus) || "#"
      };
    });
    content.exams = list;
  }

  function renderPapers() {
    ensureShape();
    var box = document.getElementById("pyqPapersList");
    var filter = (document.getElementById("pyqPaperFilter") || {}).value || "";
    if (!box) return;
    box.innerHTML = "";
    var names = examNames();
    var papers = content.papers.slice();
    if (filter) papers = papers.filter(function (p) { return p.exam === filter; });
    papers.forEach(function (p) {
      var pid = p.id || uid();
      p.id = pid;
      var examOpts = names.map(function (n) {
        return '<option value="' + esc(n) + '"' + (p.exam === n ? " selected" : "") + ">" + esc(n) + "</option>";
      }).join("");
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.setAttribute("data-paper-id", pid);
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Paper</strong>' +
        '<button type="button" class="btn btn-sm btn-gv-danger pyq-del-paper" data-id="' + esc(pid) + '">Delete</button></div>' +
        '<div class="form-group"><label>Title *</label><input class="form-control pp-title" value="' + esc(p.title) + '"></div>' +
        '<div class="form-row">' +
        '<div class="col-md-3"><label>Exam *</label><select class="form-control pp-exam">' + examOpts + '</select></div>' +
        '<div class="col-md-2"><label>Year</label><input class="form-control pp-year" value="' + esc(p.year) + '"></div>' +
        '<div class="col-md-2"><label>Class</label><input class="form-control pp-class" value="' + esc(p.class) + '"></div>' +
        '<div class="col-md-3"><label>Subject</label><input class="form-control pp-subject" value="' + esc(p.subject) + '"></div>' +
        '</div>' +
        '<div class="form-row mt-2">' +
        '<div class="col-md-6"><label>View URL</label><input class="form-control pp-view" id="pp-view-' + esc(pid) + '" value="' + esc(p.view || p.viewUrl || "") + '">' +
        fileInputHtml(pid, "application/pdf") + '</div>' +
        '<div class="col-md-6"><label>Download URL</label><input class="form-control pp-dl" id="pp-dl-' + esc(pid) + '" value="' + esc(p.download || p.downloadUrl || "") + '"></div>' +
        '</div>';
      box.appendChild(div);
    });
    bindUploads(box);
    box.querySelectorAll(".pyq-file").forEach(function (f) {
      f.setAttribute("data-folder", "papers");
    });
    box.querySelectorAll(".pyq-del-paper").forEach(function (btn) {
      btn.onclick = function () {
        syncPapersFromForm();
        var id = btn.getAttribute("data-id");
        content.papers = content.papers.filter(function (p) { return p.id !== id; });
        renderPapers();
        renderOverview();
      };
    });
    box.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.oninput = el.onchange = function () { syncPapersFromForm(); renderOverview(); };
    });
  }

  function syncPapersFromForm() {
    ensureShape();
    document.querySelectorAll("#pyqPapersList .admin-card-item").forEach(function (card) {
      var id = card.getAttribute("data-paper-id");
      var paper = content.papers.find(function (p) { return p.id === id; });
      if (!paper) return;
      var view = card.querySelector(".pp-view").value.trim();
      var dl = card.querySelector(".pp-dl").value.trim();
      paper.title = card.querySelector(".pp-title").value.trim();
      paper.exam = card.querySelector(".pp-exam").value;
      paper.year = card.querySelector(".pp-year").value.trim();
      paper.class = card.querySelector(".pp-class").value.trim();
      paper.subject = card.querySelector(".pp-subject").value.trim();
      paper.view = view;
      paper.download = dl;
      paper.viewUrl = view;
      paper.downloadUrl = dl;
    });
  }

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function htmlToPlain(html) {
    if (!html) return "";
    return html.replace(/<li>/gi, '• ').replace(/<\/li>/gi, '\n').replace(/<br\s*[\/]?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '').replace(/\n\s*\n/g, '\n').trim();
  }

  function plainToHtml(text) {
    if (!text) return "";
    var lines = text.split(/\r?\n/);
    var html = "";
    var inList = false;
    lines.forEach(function (l) {
      l = l.trim();
      if (!l) return;
      if (l.startsWith("•") || l.startsWith("-")) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + esc(l.substring(1).trim()) + "</li>";
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        html += "<p>" + esc(l) + "</p>";
      }
    });
    if (inList) html += "</ul>";
    return html;
  }

  function syncAll() {
    syncExamsFromForm();
    syncPapersFromForm();
  }

  function renderAll() {
    renderOverview();
    renderExams();
    var filterEl = document.getElementById("pyqPaperFilter");
    if (filterEl && !filterEl._bound) {
      filterEl._bound = true;
      filterEl.innerHTML = '<option value="">All exams</option>' +
        examNames().map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + "</option>"; }).join("");
      filterEl.onchange = renderPapers;
    } else if (filterEl) {
      var v = filterEl.value;
      filterEl.innerHTML = '<option value="">All exams</option>' +
        examNames().map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + "</option>"; }).join("");
      filterEl.value = v;
    }
    renderPapers();
  }

  function setContent(c) {
    content = c;
    ensureShape();
  }

  function getContent() {
    syncAll();
    return content;
  }

  function init(opts) {
    toastFn = opts.toast || toastFn;
    document.getElementById("btnSeedPyq").onclick = function () {
      if (!confirm("Import default PYQ data? This overwrites Firestore PYQ content.")) return;
      content = deepClone(window.GV_PYQ_DEFAULT_CONTENT || { papers: [], examDetails: {}, exams: [] });
      renderAll();
      toastFn("Default PYQ data loaded. Click Save Changes.");
    };

    // Track last added exam so "Add question paper" attaches to the newly created exam.
    // (Fixes: paper button not working for a new exam.)
    var lastAddedExamName = "";

    document.getElementById("btnAddPyqExam").onclick = function () {
      syncExamsFromForm();
      var name = prompt("Exam name (e.g. JEE, NEET):");
      if (!name) return;
      name = name.trim();

      // Prevent duplicates (and keep active true)
      var existing = content.exams.find(function (e) { return e.name === name; });
      if (existing) {
        existing.active = true;
      } else {
        content.exams.push({ name: name, active: true });
      }

      if (!content.examDetails[name]) {
        content.examDetails[name] = { emoji: "📋", subtitle: "", format: "<p>Details coming soon.</p>", syllabus: "#" };
      }

      lastAddedExamName = name;

      renderExams();
      renderPapers();
    };

    document.getElementById("btnAddPyqPaper").onclick = function () {
      syncPapersFromForm();

      // Prefer: last added exam name (from newly created exam)
      // Else: current filter dropdown
      // Else: first active exam name
      var names = examNames();
      var filterEl = document.getElementById("pyqPaperFilter");
      var filterVal = filterEl ? (filterEl.value || "") : "";

      var chosenExam = (lastAddedExamName && names.indexOf(lastAddedExamName) !== -1)
        ? lastAddedExamName
        : (filterVal && names.indexOf(filterVal) !== -1 ? filterVal : (names[0] || "JEE"));

      content.papers.unshift({
        id: uid(),
        title: "New Question Paper",
        exam: chosenExam,
        year: String(new Date().getFullYear()),
        class: "12",
        subject: "All-in-one",
        view: "#",
        download: "#"
      });

      // After inserting, refresh lists so upload animation + dropdowns bind correctly.
      renderPapers();
      renderOverview();
      if (lastAddedExamName) lastAddedExamName = "";
    };
  }

  return {
    setContent: setContent,
    getContent: getContent,
    syncAll: syncAll,
    renderAll: renderAll,
    init: init
  };
})();
