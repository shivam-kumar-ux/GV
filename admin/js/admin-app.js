/**
 * GV Admin Dashboard — site content editor (Shahpur active)
 */
(function () {
  var content = null;
  var currentResultsYear = null;
  var currentMemYear = null;
  var activeSite = "shahpur";
  var sessionProfile = null;

  function toast(msg, type) {
    var el = document.getElementById("adminToast");
    el.innerHTML = '<div class="alert alert-' + (type || "success") + ' shadow">' + msg + "</div>";
    setTimeout(function () { el.innerHTML = ""; }, 4000);
  }

  function uid() {
    return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  }

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function getYouTubeId(url) {
    if (!url) return "";
    if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
      return url;
    }
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  function iconSuggestionsHtml(targetId) {
    var icons = [
      { cls: "fa-book", label: "Book" },
      { cls: "fa-graduation-cap", label: "Grad" },
      { cls: "fa-school", label: "School" },
      { cls: "fa-chalkboard-teacher", label: "Teacher" },
      { cls: "fa-microscope", label: "Science" },
      { cls: "fa-calculator", label: "Math" },
      { cls: "fa-laptop-code", label: "Computer" },
      { cls: "fa-brain", label: "Brain" }
    ];
    var html = '<div class="mt-1 icon-suggestions" style="line-height: 1.8;">';
    icons.forEach(function (ico) {
      html += '<button type="button" class="btn btn-xs btn-outline-secondary py-0 px-1 mr-1 mb-1 btn-icon-suggest" style="font-size: 11px;" data-icon="' + ico.cls + '" data-target="' + targetId + '">' +
        '<i class="fa ' + ico.cls + ' mr-1"></i>' + ico.label + '</button>';
    });
    html += '</div>';
    return html;
  }

  function fileInputHtml(id, accept) {
    return '<div class="d-flex align-items-center mt-1">' +
      '<input type="file" class="form-control-file gv-file" data-target="' + id + '" accept="' + (accept || "image/*") + '">' +
      '<button type="button" class="btn btn-sm btn-primary ml-2 btn-gv-upload" disabled style="white-space: nowrap;">Upload</button>' +
      '</div>';
  }

  function bindFileUploads(container) {
    container.querySelectorAll(".gv-file").forEach(function (inp) {
      var containerDiv = inp.closest("div");
      var btn = containerDiv ? containerDiv.querySelector(".btn-gv-upload") : null;

      inp.onchange = function () {
        if (btn) {
          btn.disabled = !inp.files[0];
        }
      };

      if (btn) {
        btn.onclick = function () {
          var file = inp.files[0];
          if (!file) {
            toast("Please choose a file first.", "warning");
            return;
          }
          var folder = inp.getAttribute("data-folder") || "uploads";
          var target = document.getElementById(inp.getAttribute("data-target"));
          inp.disabled = true;
          btn.disabled = true;
          GVFirebase.uploadFile(file, folder).then(function (url) {
            if (target) {
              target.value = url;
              target.dispatchEvent(new Event('input', { bubbles: true }));
            }
            toast("File uploaded successfully.");
          }).catch(function (e) {
            toast(e.message, "danger");
          }).finally(function () {
            inp.disabled = false;
            btn.disabled = false;
          });
        };
      }
    });
  }

  function initNav() {
    document.querySelectorAll(".admin-nav-link[data-section]").forEach(function (link) {
      link.onclick = function (e) {
        e.preventDefault();
        var sec = link.getAttribute("data-section");
        if (sec === "staff" && (!sessionProfile || !GVFirebase.isSuperAdminEmail(sessionProfile.email))) {
          toast("Access denied. Super admin only.", "danger");
          return;
        }
        document.querySelectorAll(".admin-nav-link").forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
        document.querySelectorAll(".admin-section").forEach(function (s) { s.classList.remove("active"); });
        document.getElementById("sec-" + sec).classList.add("active");
        document.getElementById("sectionTitle").textContent = link.textContent.trim();
        if (window.innerWidth < 992) {
          document.getElementById("adminSidebar").classList.remove("open");
        }
      };
    });
    document.getElementById("btnToggleSidebar").onclick = function () {
      document.getElementById("adminSidebar").classList.toggle("open");
    };
  }

  /* ---------- Achievers ---------- */
  function renderAchievers() {
    var box = document.getElementById("achieversList");
    box.innerHTML = "";
    (content.achievers || []).forEach(function (s, idx) {
      var detailsStr = JSON.stringify(s.details || [], null, 0);
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Student ' + (idx + 1) + '</strong>' +
        '<button type="button" class="btn btn-sm btn-gv-danger btn-del-achiever" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-3"><label>Photo URL</label><input class="form-control ach-photo" id="ach-ph-' + idx + '" data-i="' + idx + '" value="' + (s.photo || "") + '">' + fileInputHtml("ach-ph-" + idx, "image/*") + '</div>' +
        '<div class="col-md-3"><label>Name</label><input class="form-control ach-name" data-i="' + idx + '" value="' + (s.name || "") + '"></div>' +
        '<div class="col-md-2"><label>Class</label><input class="form-control ach-class" data-i="' + idx + '" value="' + (s.class || "") + '"></div>' +
        '<div class="col-md-2"><label>Exam</label><input class="form-control ach-exam" data-i="' + idx + '" value="' + (s.exam || "") + '"></div>' +
        '<div class="col-md-2"><label>Rank</label><input class="form-control ach-rank" data-i="' + idx + '" value="' + (s.rank || "") + '"></div>' +
        '</div><div class="form-group mt-2"><label>Headline Achievement</label><input class="form-control ach-achievement" data-i="' + idx + '" value="' + (s.achievement || "") + '"></div>' +
        '<div class="form-group"><label>Details (JSON: [{label,value}])</label><textarea class="form-control ach-details" data-i="' + idx + '" rows="2">' + detailsStr + '</textarea></div>';
      box.appendChild(div);
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "achievers"); });
    box.querySelectorAll(".btn-del-achiever").forEach(function (btn) {
      btn.onclick = function () {
        content.achievers.splice(+btn.getAttribute("data-i"), 1);
        renderAchievers();
      };
    });
    box.querySelectorAll("input,textarea").forEach(function (el) {
      el.oninput = syncAchieversFromForm;
    });
  }

  function syncAchieversFromForm() {
    var list = [];
    document.querySelectorAll("#achieversList .admin-card-item").forEach(function (card, idx) {
      var details = [];
      try { details = JSON.parse(card.querySelector(".ach-details").value || "[]"); } catch (e) { }
      list.push({
        name: card.querySelector(".ach-name").value,
        class: card.querySelector(".ach-class").value,
        exam: card.querySelector(".ach-exam").value,
        rank: card.querySelector(".ach-rank").value,
        achievement: card.querySelector(".ach-achievement").value,
        photo: card.querySelector(".ach-photo").value,
        details: details
      });
    });
    content.achievers = list;
  }

  /* ---------- Alumni ---------- */
  function renderAlumni() {
    var box = document.getElementById("alumniList");
    box.innerHTML = "";
    (content.alumni || []).forEach(function (a, idx) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Alumni ' + (idx + 1) + '</strong><button class="btn btn-sm btn-gv-danger btn-del-alumni" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row"><div class="col-md-4"><label>Photo URL</label><input class="form-control al-photo" id="al-ph-' + idx + '" value="' + (a.photo || "") + '">' + fileInputHtml("al-ph-" + idx, "image/*") + '</div>' +
        '<div class="col-md-4"><label>Name</label><input class="form-control al-name" value="' + (a.name || "") + '"></div>' +
        '<div class="col-md-4"><label>Achievement</label><input class="form-control al-ach" value="' + (a.achievement || "") + '"></div></div>';
      box.appendChild(div);
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "alumni"); });
    box.querySelectorAll(".btn-del-alumni").forEach(function (btn) {
      btn.onclick = function () { content.alumni.splice(+btn.getAttribute("data-i"), 1); renderAlumni(); };
    });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncAlumniFromForm; });
  }

  function syncAlumniFromForm() {
    var list = [];
    document.querySelectorAll("#alumniList .admin-card-item").forEach(function (card) {
      list.push({
        photo: card.querySelector(".al-photo").value,
        name: card.querySelector(".al-name").value,
        achievement: card.querySelector(".al-ach").value
      });
    });
    content.alumni = list;
  }

  /* ---------- Programs ---------- */
  function renderPrograms() {
    var box = document.getElementById("programsList");
    box.innerHTML = "";
    (content.programs || []).forEach(function (p, idx) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>' + (p.title || "Program") + '</strong><button class="btn btn-sm btn-gv-danger btn-del-prog" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-4"><label>Title</label><input class="form-control pr-title" value="' + (p.title || "") + '"></div>' +
        '<div class="col-md-4"><label>Age Label</label><input class="form-control pr-age" value="' + (p.ageLabel || "") + '"></div>' +
        '<div class="col-md-4"><label>Icon class (fa-book)</label><input class="form-control pr-icon" id="pr-icon-' + idx + '" value="' + (p.icon || "fa-book") + '">' +
        iconSuggestionsHtml("pr-icon-" + idx) +
        '</div>' +
        '</div><div class="form-group"><label>Description</label><textarea class="form-control pr-desc" rows="2">' + (p.description || "") + '</textarea></div>' +
        '<div class="form-row">' +
        '<div class="col-md-6"><label>Routine PDF URL</label><input class="form-control pr-routine" id="pr-r-' + idx + '" value="' + (p.routineUrl || "") + '">' + fileInputHtml("pr-r-" + idx, "application/pdf") + '</div>' +
        '<div class="col-md-6"><label>Syllabus PDF URL</label><input class="form-control pr-syllabus" id="pr-s-' + idx + '" value="' + (p.syllabusUrl || "") + '">' + fileInputHtml("pr-s-" + idx, "application/pdf") + '</div></div>';
      box.appendChild(div);
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f, i) {
      f.setAttribute("data-folder", i % 2 ? "syllabus" : "routine");
    });
    box.querySelectorAll(".btn-del-prog").forEach(function (btn) {
      btn.onclick = function () { content.programs.splice(+btn.getAttribute("data-i"), 1); renderPrograms(); };
    });
    box.querySelectorAll(".btn-icon-suggest").forEach(function (btn) {
      btn.onclick = function () {
        var iconClass = btn.getAttribute("data-icon");
        var targetInput = document.getElementById(btn.getAttribute("data-target"));
        if (targetInput) {
          targetInput.value = iconClass;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
          syncProgramsFromForm();
        }
      };
    });
    box.querySelectorAll("input,textarea").forEach(function (el) { el.oninput = syncProgramsFromForm; });
  }

  function syncProgramsFromForm() {
    var list = [];
    document.querySelectorAll("#programsList .admin-card-item").forEach(function (card) {
      list.push({
        title: card.querySelector(".pr-title").value,
        ageLabel: card.querySelector(".pr-age").value,
        description: card.querySelector(".pr-desc").value,
        icon: card.querySelector(".pr-icon").value,
        iconBg: "bg-primary",
        routineUrl: card.querySelector(".pr-routine").value,
        syllabusUrl: card.querySelector(".pr-syllabus").value
      });
    });
    content.programs = list;
  }

  /* ---------- Results by year ---------- */
  function getResultsYears() {
    return Object.keys(content.resultsByYear || {}).sort(function (a, b) { return b - a; });
  }

  function renderResultsYearSelect() {
    var sel = document.getElementById("resultsYearSelect");
    var years = getResultsYears();
    if (!years.length) {
      content.resultsByYear = { "2025": { stats: { selections: 0, exams: 0, toppers: 0 }, exams: [] } };
      years = ["2025"];
    }
    if (!currentResultsYear || !content.resultsByYear[currentResultsYear]) {
      currentResultsYear = years[0];
    }
    sel.innerHTML = years.map(function (y) {
      return '<option value="' + y + '"' + (y === currentResultsYear ? " selected" : "") + ">" + y + "</option>";
    }).join("");
    sel.onchange = function () {
      syncResultsFromForm();
      currentResultsYear = sel.value;
      renderResultsExams();
    };
    renderResultsExams();
  }

  function renderResultsExams() {
    var yd = content.resultsByYear[currentResultsYear];
    if (!yd) return;
    document.getElementById("rbySelections").value = yd.stats.selections;
    document.getElementById("rbyExams").value = yd.stats.exams;
    document.getElementById("rbyToppers").value = yd.stats.toppers;
    var box = document.getElementById("resultsExamsList");
    box.innerHTML = "";
    (yd.exams || []).forEach(function (exam, ei) {
      var div = document.createElement("div");
      div.className = "admin-card-item admin-nested";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Exam: ' + (exam.name || "") + '</strong><button class="btn btn-sm btn-gv-danger btn-del-exam" data-ei="' + ei + '">Delete Exam</button></div>' +
        '<div class="form-row mb-2">' +
        '<div class="col-md-4"><label>Exam Name</label><input class="form-control ex-name" data-ei="' + ei + '" value="' + (exam.name || "") + '"></div>' +
        '<div class="col-md-2"><label>Icon</label><input class="form-control ex-icon" data-ei="' + ei + '" value="' + (exam.icon || "📋") + '"></div>' +
        '<div class="col-md-3"><label>Color (#hex)</label><input class="form-control ex-color" data-ei="' + ei + '" value="' + (exam.color || "#4CAF50") + '"></div>' +
        '</div><div class="ex-students" data-ei="' + ei + '"></div>' +
        '<button type="button" class="btn btn-outline-secondary btn-sm btn-add-student" data-ei="' + ei + '">+ Add Student</button>';
      box.appendChild(div);
      var stBox = div.querySelector(".ex-students");
      (exam.results || []).forEach(function (r, ri) {
        stBox.innerHTML += studentResultRow(ei, ri, r);
      });
      div.querySelector(".btn-add-student").onclick = function () {
        syncResultsFromForm();
        var currentYd = content.resultsByYear[currentResultsYear];
        if (currentYd && currentYd.exams && currentYd.exams[ei]) {
          if (!currentYd.exams[ei].results) currentYd.exams[ei].results = [];
          currentYd.exams[ei].results.push({ rank: 1, name: "", meta: "", photo: "" });
        }
        renderResultsExams();
      };
      div.querySelector(".btn-del-exam").onclick = function () {
        syncResultsFromForm();
        var currentYd = content.resultsByYear[currentResultsYear];
        if (currentYd && currentYd.exams) {
          currentYd.exams.splice(ei, 1);
        }
        renderResultsExams();
      };
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "results"); });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncResultsFromForm; });
    box.querySelectorAll(".btn-del-student").forEach(function (btn) {
      btn.onclick = function () {
        syncResultsFromForm();
        var currentYd = content.resultsByYear[currentResultsYear];
        var parts = btn.getAttribute("data-id").split("-");
        var ei = +parts[0];
        var ri = +parts[1];
        if (currentYd && currentYd.exams && currentYd.exams[ei] && currentYd.exams[ei].results) {
          currentYd.exams[ei].results.splice(ri, 1);
        }
        renderResultsExams();
      };
    });
  }

  function studentResultRow(ei, ri, r) {
    return '<div class="form-row mt-2 align-items-end border-top pt-2">' +
      '<div class="col-md-1"><label>Rank</label><input class="form-control st-rank" data-ei="' + ei + '" data-ri="' + ri + '" type="number" value="' + (r.rank || 1) + '"></div>' +
      '<div class="col-md-3"><label>Name</label><input class="form-control st-name" data-ei="' + ei + '" data-ri="' + ri + '" value="' + (r.name || "") + '"></div>' +
      '<div class="col-md-3"><label>Achievement</label><input class="form-control st-meta" data-ei="' + ei + '" data-ri="' + ri + '" value="' + (r.meta || "") + '"></div>' +
      '<div class="col-md-3"><label>Photo URL</label><input class="form-control st-photo" id="st-ph-' + ei + '-' + ri + '" data-ei="' + ei + '" data-ri="' + ri + '" value="' + (r.photo || "") + '">' +
      fileInputHtml("st-ph-" + ei + "-" + ri, "image/*") + '</div>' +
      '<div class="col-md-2"><button type="button" class="btn btn-sm btn-gv-danger btn-del-student" data-id="' + ei + '-' + ri + '">Remove</button></div></div>';
  }

  function syncResultsFromForm() {
    var yd = content.resultsByYear[currentResultsYear];
    if (!yd) return;
    yd.stats = {
      selections: +document.getElementById("rbySelections").value || 0,
      exams: +document.getElementById("rbyExams").value || 0,
      toppers: +document.getElementById("rbyToppers").value || 0
    };
    var exams = [];
    document.querySelectorAll("#resultsExamsList > .admin-card-item").forEach(function (card) {
      var ei = card.querySelector(".ex-name").getAttribute("data-ei");
      var exam = {
        name: card.querySelector(".ex-name").value,
        icon: card.querySelector(".ex-icon").value,
        color: card.querySelector(".ex-color").value,
        results: []
      };
      card.querySelectorAll(".st-name").forEach(function (nm) {
        var eii = nm.getAttribute("data-ei");
        var rii = nm.getAttribute("data-ri");
        var row = nm.closest(".form-row");
        exam.results.push({
          rank: +row.querySelector(".st-rank").value || 1,
          name: row.querySelector(".st-name").value,
          meta: row.querySelector(".st-meta").value,
          photo: row.querySelector(".st-photo").value
        });
      });
      exams.push(exam);
    });
    yd.exams = exams;
  }

  /* ---------- YouTube ---------- */
  function renderYoutube() {
    var box = document.getElementById("youtubeList");
    box.innerHTML = "";
    if (!content.gallery) content.gallery = {};
    (content.gallery.youtube || []).forEach(function (v, idx) {
      var fullUrl = v.id;
      if (v.id && !v.id.includes("http") && !v.id.includes("youtu")) {
        fullUrl = "https://www.youtube.com/watch?v=" + v.id;
      }
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Video ' + (idx + 1) + '</strong><button class="btn btn-sm btn-gv-danger btn-del-yt" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-5"><label>YouTube Video URL</label><input class="form-control yt-url" value="' + fullUrl + '" placeholder="e.g. https://www.youtube.com/watch?v=..."></div>' +
        '<div class="col-md-4"><label>Title</label><input class="form-control yt-title" value="' + (v.title || "") + '"></div>' +
        '<div class="col-md-3"><label>Date</label><input class="form-control yt-date" value="' + (v.date || "") + '"></div></div>';
      box.appendChild(div);
    });
    box.querySelectorAll(".btn-del-yt").forEach(function (btn) {
      btn.onclick = function () { content.gallery.youtube.splice(+btn.getAttribute("data-i"), 1); renderYoutube(); };
    });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncYoutube; });
  }

  function syncYoutube() {
    var list = [];
    document.querySelectorAll("#youtubeList .admin-card-item").forEach(function (card) {
      var urlValue = card.querySelector(".yt-url").value;
      var extractedId = getYouTubeId(urlValue);
      list.push({ id: extractedId, title: card.querySelector(".yt-title").value, date: card.querySelector(".yt-date").value });
    });
    if (!content.gallery) content.gallery = {};
    content.gallery.youtube = list;
  }

  /* ---------- Instagram ---------- */
  function renderInstagram() {
    var box = document.getElementById("instagramList");
    box.innerHTML = "";
    (content.gallery.instagram || []).forEach(function (url, idx) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Post ' + (idx + 1) + '</strong><button class="btn btn-sm btn-gv-danger btn-del-ig" data-i="' + idx + '">Delete</button></div>' +
        '<label>Instagram Post URL</label><input class="form-control ig-url" value="' + url + '">';
      box.appendChild(div);
    });
    box.querySelectorAll(".btn-del-ig").forEach(function (btn) {
      btn.onclick = function () { content.gallery.instagram.splice(+btn.getAttribute("data-i"), 1); renderInstagram(); };
    });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncInstagram; });
  }

  function syncInstagram() {
    var list = [];
    document.querySelectorAll("#instagramList .admin-card-item").forEach(function (card) {
      list.push(card.querySelector(".ig-url").value);
    });
    content.gallery.instagram = list;
  }

  /* ---------- Memories ---------- */
  function getMemYears() {
    return Object.keys((content.gallery && content.gallery.memories) || {}).sort(function (a, b) { return b - a; });
  }

  function renderMemoriesYearSelect() {
    if (!content.gallery) content.gallery = {};
    if (!content.gallery.memories) content.gallery.memories = {};
    var sel = document.getElementById("memoriesYearSelect");
    var years = getMemYears();
    if (!years.length) {
      content.gallery.memories["2025"] = [];
      years = ["2025"];
    }
    if (!currentMemYear || !content.gallery.memories[currentMemYear]) currentMemYear = years[0];
    sel.innerHTML = years.map(function (y) {
      return '<option value="' + y + '"' + (y === currentMemYear ? " selected" : "") + ">" + y + "</option>";
    }).join("");
    sel.onchange = function () {
      syncMemoriesFromForm();
      currentMemYear = sel.value;
      renderMemoriesEvents();
    };
    renderMemoriesEvents();
  }

  function renderMemoriesEvents() {
    var events = content.gallery.memories[currentMemYear] || [];
    var box = document.getElementById("memoriesEventsList");
    box.innerHTML = "";
    events.forEach(function (ev, ei) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Event</strong><button class="btn btn-sm btn-gv-danger btn-del-event" data-ei="' + ei + '">Delete Event</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-4"><label>Title</label><input class="form-control ev-title" data-ei="' + ei + '" value="' + (ev.title || "") + '"></div>' +
        '<div class="col-md-2"><label>Icon</label><input class="form-control ev-icon" data-ei="' + ei + '" value="' + (ev.icon || "🎭") + '"></div>' +
        '<div class="col-md-3"><label>Date</label><input class="form-control ev-date" data-ei="' + ei + '" value="' + (ev.date || "") + '"></div></div>' +
        '<div class="ev-photos mt-2" data-ei="' + ei + '"></div>' +
        '<button type="button" class="btn btn-outline-secondary btn-sm btn-add-photo" data-ei="' + ei + '">+ Add Photo</button>';
      box.appendChild(div);
      var pBox = div.querySelector(".ev-photos");
      (ev.photos || []).forEach(function (ph, pi) {
        pBox.innerHTML += '<div class="form-row mt-2">' +
          '<div class="col-md-5"><label>Image URL</label><input class="form-control ph-src" id="ph-' + ei + '-' + pi + '" value="' + (ph.src || "") + '">' + fileInputHtml("ph-" + ei + "-" + pi, "image/*") + '</div>' +
          '<div class="col-md-5"><label>Caption</label><input class="form-control ph-cap" value="' + (ph.caption || "") + '"></div>' +
          '<div class="col-md-2 d-flex align-items-end"><button class="btn btn-sm btn-gv-danger btn-del-photo" data-ei="' + ei + '" data-pi="' + pi + '">Remove</button></div></div>';
      });
      div.querySelector(".btn-add-photo").onclick = function () {
        syncMemoriesFromForm();
        var currentEvents = content.gallery.memories[currentMemYear];
        if (currentEvents && currentEvents[ei]) {
          if (!currentEvents[ei].photos) currentEvents[ei].photos = [];
          currentEvents[ei].photos.push({ src: "", caption: "" });
        }
        renderMemoriesEvents();
      };
      div.querySelector(".btn-del-event").onclick = function () {
        syncMemoriesFromForm();
        var currentEvents = content.gallery.memories[currentMemYear];
        if (currentEvents) {
          currentEvents.splice(ei, 1);
        }
        renderMemoriesEvents();
      };
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "gallery"); });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncMemoriesFromForm; });
    box.querySelectorAll(".btn-del-photo").forEach(function (btn) {
      btn.onclick = function () {
        syncMemoriesFromForm();
        var currentEvents = content.gallery.memories[currentMemYear];
        var ei = +btn.getAttribute("data-ei");
        var pi = +btn.getAttribute("data-pi");
        if (currentEvents && currentEvents[ei] && currentEvents[ei].photos) {
          currentEvents[ei].photos.splice(pi, 1);
        }
        renderMemoriesEvents();
      };
    });
  }

  function syncMemoriesFromForm() {
    var events = [];
    document.querySelectorAll("#memoriesEventsList > .admin-card-item").forEach(function (card) {
      var photos = [];
      card.querySelectorAll(".ph-src").forEach(function (srcInp) {
        var row = srcInp.closest(".form-row");
        photos.push({ src: srcInp.value, caption: row.querySelector(".ph-cap").value });
      });
      events.push({
        title: card.querySelector(".ev-title").value,
        icon: card.querySelector(".ev-icon").value,
        date: card.querySelector(".ev-date").value,
        photos: photos
      });
    });
    content.gallery.memories[currentMemYear] = events;
  }

  /* ---------- Hostel ---------- */
  function renderHostel() {
    var hostelUrlInput = document.getElementById("hostelMenuUrl");
    var hostelFileInput = document.getElementById("hostelMenuFile");
    var hostelUploadBtn = document.getElementById("btnHostelMenuUpload");

    hostelUrlInput.value = (content.hostel && content.hostel.menuPdfUrl) || "";

    hostelFileInput.onchange = function () {
      if (hostelUploadBtn) {
        hostelUploadBtn.disabled = !hostelFileInput.files[0];
      }
    };

    if (hostelUploadBtn) {
      hostelUploadBtn.onclick = function () {
        var file = hostelFileInput.files[0];
        if (!file) {
          toast("Please choose a file first.", "warning");
          return;
        }
        hostelFileInput.disabled = true;
        hostelUploadBtn.disabled = true;
        GVFirebase.uploadFile(file, "hostel").then(function (url) {
          hostelUrlInput.value = url;
          if (!content.hostel) content.hostel = {};
          content.hostel.menuPdfUrl = url;
          toast("Menu PDF uploaded successfully.");
        }).catch(function (e) {
          toast(e.message, "danger");
        }).finally(function () {
          hostelFileInput.disabled = false;
          hostelUploadBtn.disabled = false;
        });
      };
    }

    hostelUrlInput.oninput = function () {
      if (!content.hostel) content.hostel = {};
      content.hostel.menuPdfUrl = this.value;
    };
  }

  /* ---------- Disclosure ---------- */
  function renderDisclosure() {
    var box = document.getElementById("disclosureList");
    box.innerHTML = "";
    (content.disclosure || []).forEach(function (d, idx) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Document</strong><button class="btn btn-sm btn-gv-danger btn-del-doc" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row"><div class="col-md-5"><label>Title</label><input class="form-control dc-title" value="' + (d.title || "") + '"></div>' +
        '<div class="col-md-5"><label>PDF URL</label><input class="form-control dc-pdf" id="dc-pdf-' + idx + '" value="' + (d.pdfUrl || "").replace(/"/g, "&quot;") + '">' + fileInputHtml("dc-pdf-" + idx, "application/pdf") + '</div></div>';
      box.appendChild(div);
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "disclosure"); });
    box.querySelectorAll(".btn-del-doc").forEach(function (btn) {
      btn.onclick = function () { content.disclosure.splice(+btn.getAttribute("data-i"), 1); renderDisclosure(); };
    });
    box.querySelectorAll("input").forEach(function (el) { el.oninput = syncDisclosure; });
  }

  function syncDisclosure() {
    var list = [];
    document.querySelectorAll("#disclosureList .admin-card-item").forEach(function (card) {
      list.push({ title: card.querySelector(".dc-title").value, pdfUrl: card.querySelector(".dc-pdf").value });
    });
    content.disclosure = list;
  }

  /* ---------- Notices ---------- */
  function renderNotices() {
    if (!content.notices) content.notices = { ticker: "", lastUpdated: "", items: [] };
    document.getElementById("noticeTicker").value = content.notices.ticker || "";
    document.getElementById("noticeLastUpdated").value = content.notices.lastUpdated || "";
    var box = document.getElementById("noticesList");
    box.innerHTML = "";
    (content.notices.items || []).forEach(function (n, idx) {
      var div = document.createElement("div");
      div.className = "admin-card-item";
      div.innerHTML =
        '<div class="d-flex justify-content-between mb-2"><strong>Notice</strong><button class="btn btn-sm btn-gv-danger btn-del-notice" data-i="' + idx + '">Delete</button></div>' +
        '<div class="form-row">' +
        '<div class="col-md-6"><label>Title</label><input class="form-control no-title" value="' + (n.title || "") + '"></div>' +
        '<div class="col-md-3"><label>Date</label><input class="form-control no-date" value="' + (n.date || "") + '"></div>' +
        '<div class="col-md-3"><label>Category</label><select class="form-control no-cat">' +
        ["exam", "event", "holiday", "admission", "general"].map(function (c) {
          return '<option value="' + c + '"' + (n.category === c ? " selected" : "") + ">" + c + "</option>";
        }).join("") + '</select></div></div>' +
        '<div class="form-group"><label>Body (HTML allowed)</label><textarea class="form-control no-body" rows="2">' + (n.body || "") + '</textarea></div>' +
        '<div class="form-row">' +
        '<div class="col-md-3"><label><input type="checkbox" class="no-pinned" ' + (n.pinned ? "checked" : "") + '> Pinned</label></div>' +
        '<div class="col-md-3"><label><input type="checkbox" class="no-new" ' + (n.isNew ? "checked" : "") + '> Show NEW badge</label></div>' +
        '<div class="col-md-6"><label>PDF attachment URL</label><input class="form-control no-pdf" id="no-pdf-' + idx + '" value="' + ((n.attachments && n.attachments[0] && n.attachments[0].url) || "") + '">' + fileInputHtml("no-pdf-" + idx, "application/pdf") + '</div></div>';
      box.appendChild(div);
    });
    bindFileUploads(box);
    box.querySelectorAll(".gv-file").forEach(function (f) { f.setAttribute("data-folder", "notices"); });
    box.querySelectorAll(".btn-del-notice").forEach(function (btn) {
      btn.onclick = function () { content.notices.items.splice(+btn.getAttribute("data-i"), 1); renderNotices(); };
    });
    document.getElementById("noticeTicker").oninput = function () { content.notices.ticker = this.value; };
    document.getElementById("noticeLastUpdated").oninput = function () { content.notices.lastUpdated = this.value; };
    box.querySelectorAll("input,textarea,select").forEach(function (el) { el.oninput = el.onchange = syncNotices; });
  }

  function syncNotices() {
    var items = [];
    document.querySelectorAll("#noticesList .admin-card-item").forEach(function (card) {
      var pdf = card.querySelector(".no-pdf").value;
      var attachments = pdf ? [{ label: "Download PDF", url: pdf, style: "primary" }] : [];
      items.push({
        title: card.querySelector(".no-title").value,
        date: card.querySelector(".no-date").value,
        category: card.querySelector(".no-cat").value,
        body: card.querySelector(".no-body").value,
        pinned: card.querySelector(".no-pinned").checked,
        isNew: card.querySelector(".no-new").checked,
        attachments: attachments
      });
    });
    content.notices.items = items;
  }

  function syncAllFromForms() {
    syncAchieversFromForm();
    syncAlumniFromForm();
    syncProgramsFromForm();
    syncResultsFromForm();
    syncYoutube();
    syncInstagram();
    syncMemoriesFromForm();
    syncDisclosure();
    syncNotices();
    if (!content.hostel) content.hostel = {};
    content.hostel.menuPdfUrl = document.getElementById("hostelMenuUrl").value;
  }

  function renderAll() {
    renderAchievers();
    renderAlumni();
    renderPrograms();
    renderResultsYearSelect();
    renderYoutube();
    renderInstagram();
    renderMemoriesYearSelect();
    renderHostel();
    renderDisclosure();
    renderNotices();
  }

  function saveAll() {
    var btn = document.getElementById("btnSaveAll");
    btn.disabled = true;
    if (activeSite === "pyq") {
      GVPyqAdmin.syncAll();
      GVFirebase.saveSiteContent(GVPyqAdmin.getContent(), "pyq").then(function () {
        toast("PYQ Hub saved! Run Sync workflow, then refresh the public PYQ page.");
      }).catch(function (e) {
        toast(e.message, "danger");
      }).finally(function () {
        btn.disabled = false;
      });
      return;
    }
    syncAllFromForms();
    GVFirebase.saveSiteContent(content).then(function () {
      toast("All changes saved! Website will update on refresh.");
      var info = document.getElementById("lastSavedInfo");
      if (info) info.textContent = "Last saved: " + new Date().toLocaleString();
    }).catch(function (e) {
      toast(e.message, "danger");
    }).finally(function () {
      btn.disabled = false;
    });
  }

  function initButtons() {
    document.getElementById("btnSaveAll").onclick = saveAll;
    var btnPyq = document.getElementById("btnSavePyq");
    if (btnPyq) btnPyq.onclick = saveAll;
    document.getElementById("btnLogout").onclick = function () {
      GVFirebase.signOut().then(function () { window.location.replace("login.html"); });
    };
    document.getElementById("btnSeedData").onclick = function () {
      if (!confirm("Import default website data to Firebase? This overwrites Firestore content.")) return;
      content = deepClone(GV_DEFAULT_CONTENT);
      GVFirebase.saveSiteContent(content).then(function () {
        toast("Website data imported.");
        renderAll();
      });
    };
    document.getElementById("btnAddAchiever").onclick = function () {
      syncAchieversFromForm();
      content.achievers.push({ name: "", photo: "", achievement: "", details: [] });
      renderAchievers();
    };
    document.getElementById("btnAddAlumni").onclick = function () {
      syncAlumniFromForm();
      content.alumni.push({ name: "", achievement: "", photo: "" });
      renderAlumni();
    };
    document.getElementById("btnAddProgram").onclick = function () {
      syncProgramsFromForm();
      content.programs.push({ title: "New Program", ageLabel: "", description: "", icon: "fa-book", iconBg: "bg-primary", routineUrl: "", syllabusUrl: "" });
      renderPrograms();
    };
    document.getElementById("btnAddYear").onclick = function () {
      var y = prompt("Enter year (e.g. 2026):");
      if (!y) return;
      syncResultsFromForm();
      if (!content.resultsByYear[y]) content.resultsByYear[y] = { stats: { selections: 0, exams: 0, toppers: 0 }, exams: [] };
      currentResultsYear = y;
      renderResultsYearSelect();
    };
    document.getElementById("btnDeleteYear").onclick = function () {
      if (!confirm("Delete year " + currentResultsYear + "?")) return;
      syncResultsFromForm();
      delete content.resultsByYear[currentResultsYear];
      currentResultsYear = null;
      renderResultsYearSelect();
    };
    document.getElementById("btnAddExam").onclick = function () {
      syncResultsFromForm();
      content.resultsByYear[currentResultsYear].exams.push({ name: "New Exam", icon: "📋", color: "#4CAF50", results: [] });
      renderResultsExams();
    };
    document.getElementById("btnAddYoutube").onclick = function () {
      syncYoutube();
      content.gallery.youtube.push({ id: "", title: "", date: "" });
      renderYoutube();
    };
    document.getElementById("btnAddInstagram").onclick = function () {
      syncInstagram();
      content.gallery.instagram.push("");
      renderInstagram();
    };
    document.getElementById("btnAddMemYear").onclick = function () {
      var y = prompt("Year for events:");
      if (!y) return;
      syncMemoriesFromForm();
      content.gallery.memories[y] = [];
      currentMemYear = y;
      renderMemoriesYearSelect();
    };
    document.getElementById("btnDeleteMemYear").onclick = function () {
      if (!confirm("Delete year " + currentMemYear + " events?")) return;
      syncMemoriesFromForm();
      delete content.gallery.memories[currentMemYear];
      currentMemYear = null;
      renderMemoriesYearSelect();
    };
    document.getElementById("btnAddEvent").onclick = function () {
      syncMemoriesFromForm();
      content.gallery.memories[currentMemYear].push({ title: "New Event", icon: "🎭", date: "", photos: [] });
      renderMemoriesEvents();
    };
    document.getElementById("btnAddDisclosure").onclick = function () {
      syncDisclosure();
      content.disclosure.push({ title: "New Document", pdfUrl: "" });
      renderDisclosure();
    };
    document.getElementById("btnAddNotice").onclick = function () {
      syncNotices();
      content.notices.items.push({ title: "", body: "", date: "", category: "general", pinned: false, isNew: false, attachments: [] });
      renderNotices();
    };
    ["rbySelections", "rbyExams", "rbyToppers"].forEach(function (id) {
      document.getElementById(id).oninput = syncResultsFromForm;
    });
  }

  function initSiteSelector() {
    var sel = document.getElementById("siteSelector");
    var sites = window.GV_SITES || {};
    sel.innerHTML = "";
    Object.keys(sites).forEach(function (id) {
      var s = sites[id];
      var opt = document.createElement("option");
      opt.value = id;
      opt.textContent = s.label + (s.active ? "" : " (soon)");
      if (!s.active) opt.disabled = true;
      if (id === activeSite) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = function () {
      activeSite = sel.value;
      GVFirebase.setActiveSite(activeSite);
      updateSiteUI();
      if (!GVFirebase.getSiteConfig(activeSite).active) return;
      GVFirebase.loadSiteContent(activeSite).then(function (c) {
        if (activeSite === "pyq") {
          GVPyqAdmin.setContent(deepClone(c));
          GVPyqAdmin.renderAll();
        } else {
          content = deepClone(c);
          renderAll();
        }
      });
    };
    document.getElementById("linkViewSite").href = GVFirebase.getSiteConfig(activeSite).publicPath + "index.html";
  }

  function updateSiteUI() {
    var cfg = GVFirebase.getSiteConfig(activeSite);
    var isActive = cfg.active;
    var isShahpur = activeSite === "shahpur" && isActive;
    var isPyq = activeSite === "pyq" && isActive;

    document.getElementById("shahpurNav").style.display = isShahpur ? "" : "none";
    document.getElementById("pyqNav").style.display = isPyq ? "" : "none";

    document.querySelectorAll(".shahpur-only").forEach(function (el) {
      el.classList.toggle("d-none", !isShahpur);
    });
    document.querySelectorAll(".pyq-only").forEach(function (el) {
      el.classList.toggle("d-none", !isPyq);
    });
    document.querySelectorAll(".shahpur-sec").forEach(function (el) {
      el.style.display = isShahpur ? "" : "none";
    });
    document.querySelectorAll(".pyq-sec").forEach(function (el) {
      el.style.display = isPyq ? "" : "none";
    });

    var isSuperAdmin = sessionProfile && GVFirebase.isSuperAdminEmail(sessionProfile.email);
    document.querySelectorAll("#shahpurNav .admin-nav-link, #pyqNav .admin-nav-link").forEach(function (l) {
      l.style.display = "";
    });
    document.querySelectorAll("#shahpurNav .admin-nav-link[data-section]").forEach(function (l) {
      if (l.classList.contains("admin-only-nav")) return;
      l.style.display = isShahpur ? "" : "none";
    });
    document.querySelectorAll("#pyqNav .admin-nav-link").forEach(function (l) {
      if (l.getAttribute("data-section") === "staff") return;
      l.style.display = isPyq ? "" : "none";
    });
    document.querySelectorAll(".admin-only-nav").forEach(function (l) {
      l.style.display = isSuperAdmin ? "" : "none";
    });

    var alertEl = document.getElementById("siteInactiveAlert");
    if (alertEl) alertEl.style.display = isActive ? "none" : "block";

    document.querySelectorAll(".site-edit-btn").forEach(function (btn) {
      btn.disabled = !isActive;
      btn.style.display = "none";
    });
    if (isShahpur) {
      var s = document.getElementById("btnSaveAll");
      if (s) s.style.display = "";
    }
    if (isPyq) {
      var p = document.getElementById("btnSavePyq");
      if (p) p.style.display = "";
    }

    var desc = document.getElementById("overviewDesc");
    if (desc) {
      desc.innerHTML = isPyq
        ? "Manage PYQ Hub exams, categories, and question papers. Update the repository of previous year question papers here, and they will be instantly available to students on the public PYQ Portal."
        : isShahpur
          ? "Manage Gyanoday Vidyalaya Shahpur website content. Update top achievers, alumni stories, programs, events, notices, and other dynamic sections to keep the Shahpur campus website up-to-date."
          : "This campus is not enabled yet.";
    }

    if (isPyq) {
      document.getElementById("sectionTitle").textContent = "PYQ Overview";
      document.querySelectorAll(".pyq-section").forEach(function (l) { l.classList.remove("active"); });
      var first = document.querySelector('.pyq-section[data-section="pyq-overview"]');
      if (first) first.classList.add("active");
      document.querySelectorAll(".admin-section").forEach(function (s) { s.classList.remove("active"); });
      var ov = document.getElementById("sec-pyq-overview");
      if (ov) ov.classList.add("active");
    } else if (isShahpur) {
      document.getElementById("sectionTitle").textContent = "Overview";
      document.querySelectorAll(".admin-section").forEach(function (s) { s.classList.remove("active"); });
      var so = document.getElementById("sec-overview");
      if (so) so.classList.add("active");
    }

    document.getElementById("linkViewSite").href = cfg.publicPath + "index.html";
  }

  function boot() {
    GVAuth.guardDashboard(function (session) {
      sessionProfile = session.profile;
      document.getElementById("adminUserEmail").textContent =
        session.profile.name + " (" + session.profile.staffId + ")";
      document.getElementById("welcomeName").textContent = session.profile.name;
      var badge = document.getElementById("userRoleBadge");
      badge.textContent = session.profile.role;
      badge.className = "badge mr-2 " + (session.profile.role === "admin" ? "badge-danger" : "badge-secondary");

      if (GVFirebase.isSuperAdminEmail(session.profile.email)) {
        GVStaffAdmin.showAdminNav(true);
        GVStaffAdmin.initStaffSection();
      } else {
        GVStaffAdmin.showAdminNav(false);
      }

      activeSite = "shahpur";
      GVFirebase.setActiveSite(activeSite);
      initSiteSelector();
      updateSiteUI();

      GVPyqAdmin.init({ toast: toast });

      GVFirebase.loadSiteContent("shahpur").then(function (c) {
        content = deepClone(c);
        initNav();
        initButtons();
        renderAll();
        return GVFirebase.loadSiteContent("pyq");
      }).then(function (pyqC) {
        GVPyqAdmin.setContent(deepClone(pyqC));
      }).catch(function () {
        GVPyqAdmin.setContent(deepClone(window.GV_PYQ_DEFAULT_CONTENT || { papers: [], examDetails: {}, exams: [] }));
      });
    });
  }

  boot();
})();
