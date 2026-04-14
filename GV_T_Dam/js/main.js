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
    
})(jQuery);
