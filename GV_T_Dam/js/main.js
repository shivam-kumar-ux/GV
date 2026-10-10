(function ($) {
    "use strict";

    function linkifyContactInfo() {
        var selectors = 'p, small, h4, span, li';
        var emailRegex = /gyanodayvidyalaya2018@gmail\.com/i;
        var emailReplaceRegex = /gyanodayvidyalaya2018@gmail\.com/gi;
        var phoneRegex = /\+91\s*8002316898|\+91\s*9955596394/;
        var phoneReplaceRegex = /\+91\s*8002316898|\+91\s*9955596394/g;
        var phoneMap = {
            '+91 8002316898': 'tel:+918002316898',
            '+91 9955596394': 'tel:+919955596394'
        };
        var locationMap = {
            'Shahpur, Bihar': 'https://maps.google.com/?q=Gyanoday+Vidyalaya+Shahpur+Bihar',
            'Tilak Nagar, Shahpur, Bihar 805110': 'https://maps.google.com/?q=Tilak+Nagar+Shahpur+Bihar+805110'
        };

        $(selectors).each(function () {
            var $el = $(this);
            var html = $el.html();
            var text = $el.text().trim();

            if (!html) return;

            if (!$el.find('a[href^="mailto:"]').length && emailRegex.test(text)) {
                html = html.replace(emailReplaceRegex, '<a href="mailto:gyanodayvidyalaya2018@gmail.com">gyanodayvidyalaya2018@gmail.com</a>');
                $el.html(html);
                html = $el.html();
            }

            if (!$el.find('a[href^="tel:"]').length && phoneRegex.test(text)) {
                html = html.replace(phoneReplaceRegex, function (match) {
                    var normalized = match.replace(/\s+/g, ' ').trim();
                    var href = phoneMap[normalized];
                    return href ? '<a href="' + href + '">' + normalized + '</a>' : match;
                });
                $el.html(html);
                html = $el.html();
            }

            if (!$el.find('a[href*="maps.google"]').length && locationMap[text]) {
                $el.html('<a href="' + locationMap[text] + '" target="_blank" rel="noopener noreferrer">' + text + '</a>');
            }
        });
    }
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        linkifyContactInfo();

        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Courses carousel
    $(".courses-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        dots: false,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
    });


    // Related carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });
    
    
    // Video Sound Control
    $(document).ready(function() {
        var headerVideo = document.getElementById('headerVideo');
        
        // Try to unmute the video on page load
        if (headerVideo) {
            headerVideo.muted = false;
            headerVideo.volume = 1;
            
            // Attempt to play with sound (may require user interaction in some browsers)
            var playPromise = headerVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    // Autoplay started successfully
                    headerVideo.muted = false;
                }).catch(function(error) {
                    // Autoplay was prevented, video is muted
                    console.log('Autoplay with sound was prevented');
                });
            }
        }
        
        // Mute video when user scrolls down the page
        $(window).scroll(function() {
            if (headerVideo) {
                if ($(this).scrollTop() > 100) {
                    // User has scrolled down - mute the video
                    headerVideo.muted = true;
                } else {
                    // User is at the top - unmute the video
                    headerVideo.muted = false;
                }
            }
        });
    });
    // Academics Modals - No protection, full PDF functionality
    $(document).ready(function() {
    // Routine modals already handled by Bootstrap data-toggle
    // Syllabus downloads handled by <a download>
    
    // Optional: Modal size adjustment
    $('.academic-modal').on('shown.bs.modal', function () {
        $(this).find('iframe').css('height', '70vh');
    });
    
    $('.academic-modal').on('hidden.bs.modal', function () {
        $(this).find('iframe').attr('src', $(this).find('iframe').attr('src'));
    });
    });
    
})(jQuery);

// ==========================================================
// GYANODAY VIDYALAYA — RESULT FETCH (v4 FINAL)
// ==========================================================
$(document).ready(function () {

  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbx0S7pS8tK8vAmO1w1_t0q6EGgmV7TjGzhjtoioqjSD-qCmeT7t6cfouz0HyvD2O4/exec';

  var CLASS_MAP = {
    'Nursery':'Nursery','LKG':'LKG','UKG':'UKG',
    '1':'Class 1','2':'Class 2','3':'Class 3','4':'Class 4',
    '5':'Class 5','6':'Class 6','7':'Class 7','8':'Class 8',
    '9':'Class 9','10':'Class 10',
    '11-science':'Class 11 Science','11-commerce':'Class 11 Commerce',
    '12-science':'Class 12 Science','12-commerce':'Class 12 Commerce'
  };

  $('#resultForm').on('submit', function (e) {
    e.preventDefault();
    var admNo    = $('#admissionNo').val().trim();
    var classVal = $('#classSelect').val();
    var examVal  = $('#examSelect').val();
    if (!admNo || !classVal || !examVal) {
      alert('Please fill in Class, Exam, and Admission Number.');
      return;
    }
    var className = CLASS_MAP[classVal] || classVal;

    $('#resultContent, #resultError').hide().html('');
    $('#resultSpinner').show();
    $('#printBtn').hide();
    $('#resultSubtitle').text(className + '  |  ' + examVal);
    $('#resultModal').modal('show');

    var src = APPS_SCRIPT_URL
      + '?admNo='     + encodeURIComponent(admNo)
      + '&className=' + encodeURIComponent(className)
      + '&examName='  + encodeURIComponent(examVal)
      + '&callback=handleResult'
      + '&t='         + Date.now();

    var s = document.createElement('script');
    s.src = src;
    s.onerror = function () {
      showResultError('Network error — cannot reach server.');
    };
    document.body.appendChild(s);
    setTimeout(function () {
      if (document.body.contains(s)) document.body.removeChild(s);
    }, 12000);
  });
});

function handleResult(data) {
  if (!data || !data.success) {
    showResultError(data ? data.error : 'Unexpected error. Please try again.');
    return;
  }
  if      (data.examType === 'pre_a')  displayPreA(data);
  else if (data.examType === 'main_a') displayMainA(data);
  else if (data.examType === 'pre_b')  displayPreB(data);
  else if (data.examType === 'main_b') displayMainB(data);
  else showResultError('Unknown result format: ' + data.examType);
}

function showResultError(msg) {
  $('#resultSpinner').hide();
  $('#resultError').html('<i class="fa fa-exclamation-triangle mr-2"></i>' + msg).show();
  $('#printBtn').hide();
}

function rcHeader(r) {
  return '<div class="rc-header">' +
      '<div style="display:flex;align-items:center;justify-content:center;gap:12px;">' +
        '<img src="img/V_logo.png" alt="Logo" style="height:55px;width:55px;object-fit:contain;" onerror="this.style.display=\'none\'">' +
        '<div>' +
          '<div style="font-size:1.2rem;font-weight:700;letter-spacing:1px;">GYANODAY VIDYALAYA</div>' +
          '<div style="font-size:0.78rem;opacity:0.9;">Tilak Nagar, Shahpur, Nawada, Bihar</div>' +
          '<div style="font-size:0.73rem;opacity:0.8;">Ph: 9955596394 | www.gyanodayvidyalaya.com</div>' +
        '</div>' +
      '</div>' +
      '<hr style="border-color:rgba(255,255,255,0.35);margin:8px 0 6px;">' +
      '<div style="font-size:1rem;font-weight:600;">' + r.exam + ' Report Card | Session: 2026-2027</div>' +
    '</div>' +
    '<div class="rc-info">' +
      '<div class="row">' +
        '<div class="col-6 mb-1"><strong>Name:</strong> ' + r.name + '</div>' +
        '<div class="col-6 mb-1"><strong>Roll No.:</strong> ' + r.rollNo + '</div>' +
        '<div class="col-6"><strong>Adm. No.:</strong> ' + r.admissionNo + '</div>' +
        '<div class="col-6"><strong>Class:</strong> ' + r['class'] + '</div>' +
      '</div>' +
    '</div>';
}

function rcFooter(r) {
  var g = calcGrade(r.totalScore, r.totalMax);
  return '<div style="margin-top:10px;">' +
    '<p class="mb-1"><strong>Total Marks Scored: ' + r.totalScore + ' / ' + r.totalMax + '</strong></p>' +
    '<p class="mb-1"><strong>Percentage: ' + r.percentage + '</strong></p>' +
    '<p class="mb-0"><strong>Grade: <span class="badge badge-' + g.color + '" style="font-size:0.95rem;padding:4px 14px;">' + g.label + '</span></strong></p>' +
  '</div>';
}

function makeTable(headers, rows) {
  var ths = '';
  for (var i = 0; i < headers.length; i++) {
    ths += '<th' + (i > 0 ? ' class="text-center"' : '') + '>' + headers[i] + '</th>';
  }
  return '<table class="table table-bordered table-sm mb-2">' +
    '<thead style="background:#1F4E79;color:white;"><tr>' + ths + '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
  '</table>';
}

// Nursery/LKG/UKG + Pre Mid 1, Pre Mid 2, Post Mid
function displayPreA(r) {
  var rows = '';
  for (var i = 0; i < r.subjects.length; i++) {
    var s = r.subjects[i];
    rows += '<tr><td class="font-weight-bold">' + s.name + '</td>' +
      '<td class="text-center">' + s.obtained + '</td>' +
      '<td class="text-center">' + s.maxMarks + '</td></tr>';
  }
  finishDisplay('<div id="printArea">' + rcHeader(r) +
    makeTable(['Subject','Marks Scored','Total Marks'], rows) +
    rcFooter(r) + '</div>');
}

// Nursery/LKG/UKG + Half Yearly / Annual
function displayMainA(r) {
  var rows = '';
  for (var i = 0; i < r.subjects.length; i++) {
    var s = r.subjects[i];
    rows += '<tr><td class="font-weight-bold">' + s.name + '</td>' +
      '<td class="text-center">' + s.written + '/' + s.maxWritten + '</td>' +
      '<td class="text-center">' + s.oral + '/' + s.maxOral + '</td>' +
      '<td class="text-center font-weight-bold">' + s.obtained + '</td>' +
      '<td class="text-center">' + s.maxTotal + '</td></tr>';
  }
  finishDisplay('<div id="printArea">' + rcHeader(r) +
    makeTable(['Subject','Written','Oral','Marks Scored','Total Marks'], rows) +
    rcFooter(r) + '</div>');
}

// Class 1-10 + Pre Mid 1, Pre Mid 2, Post Mid
function displayPreB(r) {
  var rows = '';
  for (var i = 0; i < r.subjects.length; i++) {
    var s = r.subjects[i];
    rows += '<tr><td class="font-weight-bold">' + s.name + '</td>' +
      '<td class="text-center">' + s.obtained + '</td>' +
      '<td class="text-center">' + s.maxMarks + '</td></tr>';
  }
  finishDisplay('<div id="printArea">' + rcHeader(r) +
    makeTable(['Subject','Marks Scored','Total Marks'], rows) +
    rcFooter(r) + '</div>');
}

// Class 1-10 + Half Yearly / Annual
function displayMainB(r) {
  var rows = '';
  for (var i = 0; i < r.subjects.length; i++) {
    var s = r.subjects[i];
    rows += '<tr><td class="font-weight-bold">' + s.name + '</td>' +
      '<td class="text-center">' + s.theory + '/' + s.maxTheory + '</td>' +
      '<td class="text-center">' + s.practical + '/' + s.maxPract + '</td>' +
      '<td class="text-center font-weight-bold">' + s.obtained + '</td>' +
      '<td class="text-center">' + s.maxTotal + '</td></tr>';
  }
  finishDisplay('<div id="printArea">' + rcHeader(r) +
    makeTable(['Subject','Theory','Practical','Marks Scored','Total Marks'], rows) +
    rcFooter(r) + '</div>');
}

function finishDisplay(html) {
  $('#resultSpinner').hide();
  $('#resultContent').html(html).show();
  $('#printBtn').show();
}

function calcGrade(obtained, max) {
  if (!max) return { label:'N/A', color:'secondary' };
  var p = (obtained / max) * 100;
  if (p >= 91) return { label:'A1', color:'success' };
  if (p >= 81) return { label:'A2', color:'success' };
  if (p >= 71) return { label:'B1', color:'info' };
  if (p >= 61) return { label:'B2', color:'info' };
  if (p >= 51) return { label:'C1', color:'warning' };
  if (p >= 41) return { label:'C2', color:'warning' };
  if (p >= 33) return { label:'D',  color:'secondary' };
  return { label:'E (Fail)', color:'danger' };
}

function printResult() {
  var area = document.getElementById('printArea');
  if (!area) return;
  var base = window.location.href.replace(/\/[^\/]*$/, '/');
  var win  = window.open('', '_blank', 'width=850,height=760');
  win.document.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<title>Result - Gyanoday Vidyalaya</title>' +
    '<base href="' + base + '">' +
    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">' +
    '<style>' +
      'body{padding:30px;font-family:Arial,sans-serif;}' +
      '.rc-header{background:#1F4E79;color:#fff;padding:14px 18px;text-align:center;border-radius:6px 6px 0 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
      '.rc-info{background:#f8f9fa;border:1px solid #dee2e6;padding:12px 18px;margin-bottom:14px;}' +
      'table{width:100%;border-collapse:collapse;margin-bottom:10px;}' +
      'th,td{border:1px solid #dee2e6;padding:7px 10px;font-size:0.9rem;}' +
      'thead th{background:#1F4E79!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
      'tbody tr:nth-child(even){background:#f8f9fa;}' +
      '.font-weight-bold{font-weight:700;}.text-center{text-align:center;}' +
      '.badge{display:inline-block;padding:3px 12px;border-radius:4px;}' +
      '.badge-success{background:#28a745;color:#fff;}.badge-info{background:#17a2b8;color:#fff;}' +
      '.badge-warning{background:#ffc107;color:#212529;}.badge-secondary{background:#6c757d;color:#fff;}' +
      '.badge-danger{background:#dc3545;color:#fff;}' +
      '.row{display:flex;flex-wrap:wrap;margin:0;}.col-6{width:50%;padding:2px 4px;}' +
      '.mb-0{margin-bottom:0!important;}.mb-1{margin-bottom:4px!important;}' +
    '</style></head><body>' + area.innerHTML + '</body></html>'
  );
  win.document.close();
  win.focus();
  setTimeout(function(){ win.print(); win.close(); }, 800);
}

// Academics Modals
$(document).ready(function() {
  $('.academic-modal').on('shown.bs.modal', function () {
    $(this).find('iframe').css('height', '70vh');
  });
  $('.academic-modal').on('hidden.bs.modal', function () {
    $(this).find('iframe').attr('src', $(this).find('iframe').attr('src'));
  });
});

// =========================================
// NOTICES PAGE FUNCTIONALITY - BLACKBOXAI
// =========================================
$(document).ready(function() {
  // Notification dot fade on notices.html visit
  if (window.location.pathname.includes('notices.html')) {
    $('.notification-dot').fadeOut(2000);
  }

  // Navbar active state for Notices
  var current = window.location.pathname.split('/').pop();
  if (current === 'notices.html' || current.includes('notices')) {
    $('.nav-link[href="notices.html"]').addClass('active');
  }

  // Notices Filtering
  $('.notice-filters .btn').on('click', function() {
    var filter = $(this).data('filter');
    
    // Update active button
    $('.notice-filters .btn').removeClass('active');
    $(this).addClass('active');
    
    // Filter cards
    if (filter === 'all') {
      $('.notice-card').fadeIn(300).removeClass('d-none');
    } else {
      $('.notice-card').each(function() {
        if ($(this).find('.badge').first().text().trim() === '[' + filter.toUpperCase() + ']') {
          $(this).fadeIn(300).removeClass('d-none');
        } else {
          $(this).fadeOut(300).addClass('d-none');
        }
      });
    }
  });

  // Blinking animation init
  $('.blinking').each(function() {
    var $this = $(this);
    setTimeout(function() {
      $this.addClass('blinking');
    }, 500);
  });

  // Smooth hover effects
  $('.notice-card').hover(
    function() { $(this).addClass('shadow-lg'); },
    function() { $(this).removeClass('shadow-lg'); }
  );
});
