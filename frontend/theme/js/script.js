/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

(function ($) {
    'use strict';

    // Preloader js    
    $(window).on('load', function () {
        $('.preloader').fadeOut(700);
    });

    // Sticky Menu
    $(window).scroll(function () {
        var height = $('.top-header').innerHeight();
        if ($('header').offset().top > 10) {
            $('.top-header').addClass('hide');
            $('.navigation').addClass('nav-bg');
            $('.navigation').css('margin-top', '-' + height + 'px');
        } else {
            $('.top-header').removeClass('hide');
            $('.navigation').removeClass('nav-bg');
            $('.navigation').css('margin-top', '-' + 0 + 'px');
        }
    });

    // navbarDropdown
    if ($(window).width() < 992) {
        $('.navigation .dropdown-toggle').on('click', function () {
            $(this).siblings('.dropdown-menu').animate({
                height: 'toggle'
            }, 300);
        });
    }

    // profileDropdown


    // Count Up
    $(document).ready(function() {
        function counter() {
            var counterElements = $('.counterUp');
            if (counterElements.length) {
                counterElements.each(function () {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    var oTop = $this.offset() ? $this.offset().top - window.innerHeight : 0;
                    if ($(window).scrollTop() > oTop) {
                        $({ countNum: $this.text() }).animate({ countNum: countTo }, {
                            duration: 1000,
                            easing: 'swing',
                            step: function () {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function () {
                                $this.text(this.countNum);
                            }
                        });
                    }
                });
            }
        }

        // Initial call to ensure counters start animating if already in view
        counter();

        // Call counter function on scroll
        $(window).on('scroll', function() {
            counter();
        });
    });

    // Background-images
    $('[data-background]').each(function () {
        $(this).css({
            'background-image': 'url(' + $(this).data('background') + ')'
        });
    });

    // Hero Slider
    $('.hero-slider').slick({
        autoplay: true,
        autoplaySpeed: 7500,
        pauseOnFocus: false,
        pauseOnHover: false,
        infinite: true,
        arrows: true,
        fade: true,
        prevArrow: '<button type=\'button\' class=\'prevArrow\'><i class=\'ti-angle-left\'></i></button>',
        nextArrow: '<button type=\'button\' class=\'nextArrow\'><i class=\'ti-angle-right\'></i></button>',
        dots: true
    });
    $('.hero-slider').slickAnimation();

    // venobox popup
    $(document).ready(function () {
        $('.venobox').venobox();
    });

    // filter
    $(document).ready(function () {
        var containerEl = document.querySelector('.filtr-container');
        var filterizd;
    
        // Inisialisasi filterizr jika elemen ada
        if (containerEl) {
            filterizd = $('.filtr-container').filterizr({});
        }
    
        // Menentukan card aktif saat halaman dimuat/reload
        function showActiveCategory() {
            // Cari elemen filter yang aktif
            var activeFilter = $('.filter-controls .active').data('filter');
    
            // Sembunyikan semua card dan tampilkan hanya card yang sesuai dengan kategori aktif
            $('.filtr-item').hide(); // Sembunyikan semua card
            $(`.filtr-item[data-category="${activeFilter}"]`).show(); // Tampilkan card yang sesuai
        }
    
        // Jalankan fungsi saat halaman dimuat
        showActiveCategory();
    
        // Active class changer dan filter handler saat klik filter
        $('.filter-controls li').on('click', function () {
            $('.filter-controls li').removeClass('active');
            $(this).addClass('active');
    
            // Tampilkan hanya card yang sesuai dengan kategori yang diklik
            var filter = $(this).data('filter');
            $('.filtr-item').hide(); // Sembunyikan semua card
            $(`.filtr-item[data-category="${filter}"]`).show(); // Tampilkan card yang sesuai
        });
    });
    

    // Testimonials //
    const slider = document.getElementById('testimonialSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 1; // Start at the first real slide
    let sliding = false;

    if (slider) {
        slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;

        // Function to handle the transition to the next slide
        function slideToNext() {
            if (sliding) return;
            sliding = true;

            currentIndex++;
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;

            if (currentIndex === slider.children.length - 1) {
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentIndex = 1; // Move to the first real item
                    slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;
                    sliding = false;
                }, 500);
            } else {
                setTimeout(() => {
                    sliding = false;
                }, 500);
            }
        }

        // Function to handle the transition to the previous slide
        function slideToPrev() {
            if (sliding) return;
            sliding = true;

            currentIndex--;
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;

            if (currentIndex === 0) {
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentIndex = slider.children.length - 2; // Move to the last real item
                    slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;
                    sliding = false;
                }, 500);
            } else {
                setTimeout(() => {
                    sliding = false;
                }, 500);
            }
        }

        // Event listeners for buttons
        if (prevBtn) prevBtn.addEventListener('click', slideToPrev);
        if (nextBtn) nextBtn.addEventListener('click', slideToNext);

        // Automatically slide every 9 seconds
        setInterval(slideToNext, 9000);

        // Adjust the slide position on window resize
        window.addEventListener('resize', () => {
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${currentIndex * slider.clientWidth}px)`;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const swipers = document.querySelectorAll('.init-swiper');
        swipers.forEach(swiper => {
            const config = JSON.parse(swiper.querySelector('.swiper-config').textContent);
            new Swiper(swiper.querySelector('.swiper-wrapper').parentElement, config);
        });
    });

    // Lazy Load
    const images = document.querySelectorAll("img");
    function loadImage() {
        images.forEach(img => {
            const src = img.getAttribute("data-src");
            if (src) {
                img.setAttribute("src", src);
                img.removeAttribute("data-src");
            }
        });
    }
    window.addEventListener("load", loadImage);

    // FAQ
    $(document).ready(function() {
        $('.faq-item h3, .faq-item .faq-toggle').on('click', function() {
            var parentItem = $(this).closest('.faq-item');
            var content = parentItem.find('.faq-content');

            if (parentItem.hasClass('faq-active')) {
                parentItem.removeClass('faq-active');
                content.css({
                    'max-height': 0,
                    'opacity': 0
                });
            } else {
                $('.faq-item').each(function() {
                    $(this).removeClass('faq-active');
                    $(this).find('.faq-content').css({
                        'max-height': 0,
                        'opacity': 0
                    });
                });
                parentItem.addClass('faq-active');
                content.css({
                    'max-height': content[0].scrollHeight + 'px',
                    'opacity': 1
                });
            }
        });
    });

    // Floating Box
    $(window).on('scroll', function () {
        var floatingBox = $('#floating-box');
        var teachersSectionElem = $('#teachers');
        var footerElem = $('footer'); // Ganti 'footer' dengan elemen footer di proyek Anda
    
        if ($(window).width() < 768) { // Memeriksa jika layar lebih kecil dari 768px
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();
            var footerOffsetTop = footerElem.offset().top;
    
            // Jika scroll belum mencapai footer
            if (scrollTop + windowHeight < footerOffsetTop) {
                floatingBox.css({
                    position: 'fixed',
                    bottom: 0,
                    top: 'auto',
                    width: '100%', // Sesuaikan width sesuai kebutuhan
                    left: 0
                });
            } else {
                // Jika sudah mencapai footer
                floatingBox.css({
                    position: 'absolute',
                    top: footerOffsetTop - floatingBox.outerHeight(),
                    bottom: 'auto'
                });
            }
        } else {
            // Kode floating box untuk desktop
            if (teachersSectionElem.length) {
                var teachersSection = teachersSectionElem.offset();
                var scrollTop = $(window).scrollTop();
    
                if (teachersSection) {
                    if (scrollTop >= teachersSection.top) {
                        floatingBox.css({
                            position: 'absolute',
                            top: teachersSection.top - floatingBox.outerHeight()
                        });
                    } else {
                        floatingBox.css({
                            position: 'sticky',
                            top: 120
                        });
                    }
                } else {
                    console.error('Teachers Section Offset is undefined');
                }
            } else {
                console.error('Element with ID "teachers" not found.');
            }
        }
    });
    
    // Floating-Box Click
    document.addEventListener("DOMContentLoaded", function() {
        function scrollToSection(id) {
            const target = document.querySelector(id);
            const offset = document.querySelector('.floating-box-wrapper').offsetHeight; // Tinggi float box

            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }

        // Menambahkan event listener ke setiap link di floating box
        document.querySelector('a[href="#course-details"]').addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('#course-details');
        });

        document.querySelector('a[href="#lesson"]').addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('#lesson');
        });

        document.querySelector('a[href="#prospek"]').addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('#prospek');
        });
    });

})(jQuery);
