/**
 * Renders Firestore content into public website pages.
 */
(function (global) {
  function esc(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function blogPosts() {
    var posts = global.GV_CONTENT && global.GV_CONTENT.blog && global.GV_CONTENT.blog.posts;
    if (Array.isArray(posts)) return posts;
    if (!global.POSTS) return [];
    return Object.keys(global.POSTS).map(function (id) {
      return Object.assign({ id: id }, global.POSTS[id]);
    });
  }

  function syncPostsGlobal(posts) {
    if (!posts || !posts.length) return;
    global.POSTS = {};
    posts.forEach(function (p, i) {
      var id = String(p.id || (i + 1));
      global.POSTS[id] = Object.assign({}, p, {
        id: id,
        cat: p.cat || "General",
        gradient: p.gradient || (p.img ? "url('" + p.img + "')" : "")
      });
    });
  }

  function blogCatSlug(cat) {
    var slug = String(cat || "general").toLowerCase();
    if (slug.indexOf("science") >= 0) return "science";
    return slug.replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function renderAchievers(trackId) {
    var track = document.getElementById(trackId || "studentSlider");
    if (!track || !global.GV_CONTENT || !global.GV_CONTENT.achievers) return;
    var list = global.GV_CONTENT.achievers;
    var html = "";
    list.forEach(function (s, i) {
      var details = (s.details || []).map(function (d) {
        return "<p><strong>" + esc(d.label) + ":</strong> " + esc(d.value) + "</p>";
      }).join("");
      if (!details && s.exam) details = "<p><strong>Exam:</strong> " + esc(s.exam) + "</p>";
      if (s.rank) details += "<p><strong>Rank:</strong> " + esc(s.rank) + "</p>";
      if (s.class) details += "<p><strong>Class:</strong> " + esc(s.class) + "</p>";
      html += '<div class="student-slide"><div class="student-card">' +
        '<img src="' + esc(s.photo) + '" alt="' + esc(s.name) + '">' +
        '<div class="student-overlay"><div class="student-info">' +
        '<span class="student-name">' + esc(s.name) + '</span>' +
        '<span class="student-achievement">' + esc(s.achievement || s.rank || "") + '</span></div>' +
        '<div class="student-details">' + details + '</div></div></div></div>';
    });
    track.innerHTML = html;
    if (typeof global.initStudentSlider === "function") global.initStudentSlider();
  }

  function renderAlumni(carouselId) {
    var el = document.getElementById(carouselId || "gvAlumniCarousel");
    if (!el || !global.GV_CONTENT || !global.GV_CONTENT.alumni) return;
    var html = "";
    global.GV_CONTENT.alumni.forEach(function (a) {
      html += '<div class="team-item"><img class="img-fluid w-100" src="' + esc(a.photo) + '" alt="' + esc(a.name) + '">' +
        '<div class="bg-light text-center p-4"><h5 class="mb-3">' + esc(a.name) + '</h5>' +
        '<p class="mb-2">' + esc(a.achievement) + '</p></div></div>';
    });
    el.innerHTML = html;
    if (global.jQuery && global.jQuery.fn.owlCarousel) {
      var $c = global.jQuery(el);
      if ($c.data("owl.carousel")) $c.trigger("destroy.owl.carousel");
      $c.owlCarousel({ loop: true, margin: 30, dots: true, autoplay: true, responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 } } });
    }
  }

  function renderPrograms(rowId) {
    var row = document.getElementById(rowId || "gvProgramsRow");
    if (!row || !global.GV_CONTENT || !global.GV_CONTENT.programs) return;
    var html = "";
    global.GV_CONTENT.programs.forEach(function (p) {
      html += '<div class="col-lg-4 col-md-6 pb-4"><div class="courses-list-item position-relative d-block overflow-hidden mb-2 bg-light"><div class="p-4">' +
        '<div class="btn-icon ' + esc(p.iconBg || "bg-primary") + ' mb-3 mx-auto"><i class="fa fa-2x ' + esc(p.icon || "fa-book") + ' text-white"></i></div>' +
        '<h4 class="text-center">' + esc(p.title) + '</h4>' +
        '<p class="text-center text-muted">' + esc(p.ageLabel) + '</p>' +
        '<p class="text-center">' + esc(p.description) + '</p>' +
        '<div class="academic-buttons">' +
        '<a href="' + esc(p.routineUrl) + '" class="routine-btn btn" download><i class="fas fa-calendar-alt mr-1"></i>Routine</a>' +
        '<a href="' + esc(p.syllabusUrl) + '" class="syllabus-btn btn" download><i class="fas fa-download mr-1"></i>Syllabus</a>' +
        '</div></div></div></div>';
    });
    row.innerHTML = html;
  }

  function renderHostelMenu(iframeId) {
    var iframe = document.getElementById(iframeId || "gvHostelMenuFrame");
    if (!iframe || !global.GV_CONTENT || !global.GV_CONTENT.hostel) return;
    var url = global.GV_CONTENT.hostel.menuPdfUrl || "docs/hostel-menu.pdf";
    iframe.src = url + "#view=FitH";
  }

  function renderDisclosure(gridId, modalsId) {
    var grid = document.getElementById(gridId || "gvDisclosureGrid");
    if (!grid || !global.GV_CONTENT || !global.GV_CONTENT.disclosure) return;
    var docs = global.GV_CONTENT.disclosure;
    var gridHtml = "";
    var modalsHtml = "";
    docs.forEach(function (d, i) {
      var mid = "gvDocModal" + i;
      gridHtml += '<div class="doc-card" data-toggle="modal" data-target="#' + mid + '">' +
        '<div class="doc-icon"><i class="fas fa-file-pdf"></i></div>' +
        '<div class="doc-title">' + esc(d.title) + '</div>' +
        '<button class="btn btn-primary btn-lg btn-block">View Document</button></div>';
      modalsHtml += '<div class="modal fade" id="' + mid + '"><div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content">' +
        '<div class="modal-header bg-primary text-white"><h5 class="modal-title font-weight-bold">' + esc(d.title) + '</h5>' +
        '<button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button></div>' +
        '<div class="modal-body position-relative p-0 protected-area">' +
        '<iframe src="' + esc(d.pdfUrl) + '" width="100%" height="600" frameborder="0" class="w-100"></iframe></div></div></div></div>';
    });
    grid.innerHTML = gridHtml;
    var modalsEl = document.getElementById(modalsId || "gvDisclosureModals");
    if (modalsEl) modalsEl.innerHTML = modalsHtml;
  }

  function renderNotices() {
    if (!global.GV_CONTENT || !global.GV_CONTENT.notices) return;
    var n = global.GV_CONTENT.notices;
    var marquee = document.getElementById("gvNoticeTicker");
    if (marquee) marquee.textContent = n.ticker || "";
    var updated = document.getElementById("gvNoticeLastUpdated");
    if (updated) updated.textContent = n.lastUpdated || "";
    var timeline = document.getElementById("nbTimeline") || document.getElementById("gvNoticesTimeline");
    if (!timeline || !n.items) return;
    var html = "";
    n.items.forEach(function (item) {
      var cat = item.category || "general";
      var pin = item.pinned ? " pinned" : "";
      var attach = (item.attachments || []).map(function (a) {
        var cls = a.style === "success" ? "success" : "primary";
        return '<a href="' + esc(a.url) + '" class="nb-attach ' + cls + '" target="_blank"><i class="fa fa-file-pdf"></i> ' + esc(a.label) + '</a>';
      }).join("");
      html += '<div class="nb-item' + pin + '" data-cat="' + esc(cat) + '" data-title="' + esc(item.title) + '">' +
        '<div class="d-flex flex-wrap align-items-center mb-2" style="gap:6px;">' +
        (item.pinned ? '<i class="fa fa-thumbtack nb-pin-icon"></i>' : "") +
        '<span class="nb-tag ' + esc(cat) + '">' + esc(cat) + '</span>' +
        (item.isNew ? '<span class="nb-new">NEW</span>' : "") +
        '<span class="nb-date ml-auto">' + esc(item.date) + '</span></div>' +
        '<div class="nb-title">' + esc(item.title) + '</div>' +
        '<div class="nb-body">' + item.body + '</div>' +
        (attach ? '<div class="d-flex flex-wrap" style="gap:8px;">' + attach + '</div>' : "") +
        '</div>';
    });
    timeline.innerHTML = html;
    var count = document.getElementById("nbCount");
    if (count) count.textContent = n.items.length + " notices";
  }

  function renderBlogPage() {
    var grid = document.getElementById("blogGrid");
    if (!grid) return;
    var posts = blogPosts();
    if (!posts.length) return;
    syncPostsGlobal(posts);

    var featured = document.querySelector(".featured-post");
    var first = posts[0];
    if (featured && first) {
      featured.setAttribute("data-cat", blogCatSlug(first.cat));
      var img = featured.querySelector(".post-img");
      if (img) img.style.backgroundImage = "url('" + esc(first.img) + "')";
      var cat = featured.querySelector(".post-category");
      if (cat) cat.textContent = first.cat || "General";
      var title = featured.querySelector(".post-title a");
      if (title) {
        title.textContent = first.title || "";
        title.setAttribute("data-id", first.id);
      }
      var excerpt = featured.querySelector(".post-excerpt");
      if (excerpt) excerpt.textContent = first.excerpt || "";
      featured.querySelectorAll(".open-post").forEach(function (btn) { btn.setAttribute("data-id", first.id); });
      var meta = featured.querySelector(".post-meta");
      if (meta) meta.innerHTML = '<span><i class="fa fa-user"></i> ' + esc(first.author) + '</span><span><i class="fa fa-calendar-alt"></i> ' + esc(first.date) + '</span><span><i class="fa fa-clock"></i> ' + esc(first.read || "3 min read") + '</span>';
    }

    grid.innerHTML = posts.slice(1).map(function (p) {
      var id = esc(p.id);
      var catSlug = blogCatSlug(p.cat);
      var initials = String(p.author || "GV").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
      return '<div class="col-md-6 mb-4 blog-post-item" data-cat="' + esc(catSlug) + '">' +
        '<div class="blog-card"><div class="card-img" style="background-image: url(\'' + esc(p.img) + '\');"><span class="post-category">' + esc(p.cat || "General") + '</span></div>' +
        '<div class="card-body"><div class="post-meta"><span><i class="fa fa-calendar-alt"></i> ' + esc(p.date) + '</span><span><i class="fa fa-clock"></i> ' + esc(p.read || "3 min read") + '</span></div>' +
        '<h3 class="post-title"><a href="#" class="open-post" data-id="' + id + '">' + esc(p.title) + '</a></h3><p class="post-excerpt">' + esc(p.excerpt) + '</p>' +
        '<div class="card-footer-row"><div class="author-chip"><div class="avatar">' + esc(initials) + '</div><span class="name">' + esc(p.author || "GV") + '</span></div>' +
        '<button class="read-more-btn open-post" data-id="' + id + '" style="padding:6px 14px;font-size:.8rem;">Read <i class="fa fa-arrow-right"></i></button></div></div></div></div>';
    }).join("");

    var recent = document.querySelector(".sidebar-widget .recent-post-item");
    var recentBox = recent && recent.parentElement;
    if (recentBox) {
      recentBox.querySelectorAll(".recent-post-item").forEach(function (n) { n.remove(); });
      posts.slice(0, 4).forEach(function (p) {
        recentBox.insertAdjacentHTML("beforeend", '<div class="recent-post-item"><div class="rp-img" style="background-image:url(\'' + esc(p.img) + '\');"></div><div class="rp-info"><div class="rp-title"><a href="#" class="open-post" data-id="' + esc(p.id) + '">' + esc(p.title) + '</a></div><div class="rp-date"><i class="fa fa-calendar-alt mr-1"></i> ' + esc(p.date) + '</div></div></div>');
      });
    }
  }

  function renderHomeBlogEvents() {
    var grid = document.getElementById("gvEventsGrid");
    if (!grid) return;
    var posts = blogPosts();
    if (!posts.length) return;
    syncPostsGlobal(posts);
    grid.innerHTML = posts.slice(0, 7).map(function (p, idx) {
      var cardClass = idx === 0 ? "gv-event-card tall" : "gv-event-card small";
      return '<div class="' + cardClass + '"><div class="card-img-wrap"><img src="' + esc(p.img) + '" alt="' + esc(p.title) + '">' +
        '<div class="card-overlay"><div class="overlay-content"><h3 class="overlay-title">' + esc(p.title) + '</h3>' +
        '<p class="overlay-desc">' + esc(p.excerpt) + '</p><a href="blog.html?post=' + esc(p.id) + '" class="btn btn-read-more">Read More</a></div></div></div>' +
        '<div class="card-banner">' + esc(p.cat || "General") + '</div></div>';
    }).join("");
  }

  function applyGalleryToGlobals() {
    if (!global.GV_CONTENT || !global.GV_CONTENT.gallery) return;
    var g = global.GV_CONTENT.gallery;
    global.YT_VIDEOS = g.youtube || [];
    global.IG_POSTS = g.instagram || [];
    global.FB_POSTS = g.facebook || [];
    global.MEMORIES = g.memories || {};
    global.RBY_DATA = global.GV_CONTENT.resultsByYear || global.RBY_DATA;
  }

  function runPageRenders() {
    var page = document.body.getAttribute("data-gv-page") || "";
    if (page === "home" || document.getElementById("studentSlider")) {
      renderAchievers("studentSlider");
      renderAlumni("gvAlumniCarousel");
    }
    if (page === "result") renderAchievers("studentSlider");
    if (page === "academics") renderPrograms();
    if (page === "hostel") renderHostelMenu();
    if (page === "disclosure") renderDisclosure();
    if (page === "notices") renderNotices();
    if (page === "blog") renderBlogPage();
    if (page === "home") renderHomeBlogEvents();
    if (page === "gallery") applyGalleryToGlobals();
    if (page === "result") {
      if (global.GV_CONTENT && global.GV_CONTENT.resultsByYear) {
        global.RBY_DATA = global.GV_CONTENT.resultsByYear;
      }
      if (typeof global.gvRerenderResultsByYear === "function") {
        global.gvRerenderResultsByYear();
      }
    }
  }

  function init() {
    var ready = global.GV_CONTENT_READY || global.GVFirebase.loadSiteContent();
    ready.then(function () {
      runPageRenders();
      document.dispatchEvent(new CustomEvent("gvContentReady"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.GVRender = {
    renderAchievers: renderAchievers,
    renderAlumni: renderAlumni,
    renderPrograms: renderPrograms,
    renderHostelMenu: renderHostelMenu,
    renderDisclosure: renderDisclosure,
    renderNotices: renderNotices,
    renderBlogPage: renderBlogPage,
    renderHomeBlogEvents: renderHomeBlogEvents,
    applyGalleryToGlobals: applyGalleryToGlobals,
    runPageRenders: runPageRenders
  };
})(window);
