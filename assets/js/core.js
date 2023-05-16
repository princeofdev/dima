/* -----------------------------------------------------------------------------

Mi. - Ultimate Personal Resume vCard Template

File:           JS Core
Version:        1.3
Last change:    20/07/16 
Author:         Suelo

-------------------------------------------------------------------------------- */

'use strict';

var Mi = {
    init: function() {

        this.Basic.init();
        this.Components.init();  

    },
    Basic: {
        init: function() {

            var self = this;

            Pace.on('done', function(){
                $('#page-loader').fadeOut(200);
                self.animations();
            });

            self.mobileDetector();
            self.backgrounds();
            self.scroller();
            self.masonry();
            self.mobileNav();

        },
        mobileDetector: function () {

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
                }
            };

            window.trueMobile = isMobile.any();

            if (trueMobile) {
                $('audio').remove();
            }

        },
        backgrounds: function() {

            // Images 
            $('.bg-image').each(function(){
                var src = $(this).children('img').attr('src');
                if(src)
                    $(this).css('background-image','url('+src+')').children('img').hide();
            });

            // Slideshow 
            $('.bg-slideshow').owlCarousel({
                singleItem: true,
                autoPlay: 4000,
                pagination: false,
                navigation: false,
                navigationText: false,
                slideSpeed: 1500,
                transitionStyle: 'fade',
                mouseDrag: false,
                touchDrag: false
            });

        },
        animations: function() {
            // Animation - hover 
            $('.animated-hover')
                .on('mouseenter', function(){
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().css({
                        '-webkit-animation-duration': duration+'ms',
                        'animation-duration': duration+'ms'
                    }).addClass(animation);
                })
                .on('mouseleave', function(){
                    var $self = $(this);
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().removeAttr('style').removeClass(animation); 
                });

            // Animation - appear 
            $('.animated').appear(function() {
                $(this).each(function(){ 
                    var $target =  $(this);
                    var delay = 200 + $(this).data('animation-delay');
                    setTimeout(function() {
                        $target.addClass($target.data('animation')).addClass('visible')
                    }, delay);
                });
            });

        },
        scroller: function() {

            var $header = $('#header');
            var headerHeight = $('#header').height();
            var $mobileNav = $('#mobile-nav');
            var $section = $('.section','#content');
            var $body = $('body');
            var scrollOffset = 0;
            if ($body.hasClass('header-horizontal')) scrollOffset = -headerHeight;

            var $scrollers = $('#header, #mobile-nav, [data-target="local-scroll"]');
            $scrollers.find('a').on('click', function(){
                $(this).blur();
            });
            $scrollers.localScroll({
                offset: scrollOffset,
                duration: 800,
                easing: $('#content').data('scroll-easing')
            });

            var $menuItem = $('#main-menu li > a, #mobile-nav li > a');
            var checkMenuItem = function(id) {
                $menuItem.each(function(){
                    var link = $(this).attr('href');
                    if(id==link) $(this).addClass('active');
                    else $(this).removeClass('active');
                });
            }
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='up') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    if ($body.hasClass('header-horizontal')) return -this.element.clientHeight+headerHeight+2;
                    else return -this.element.clientHeight+2;
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='down') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    if ($body.hasClass('header-horizontal')) return headerHeight+1;
                    else return 1;
                }
            });
            $(window).resize(function(){
                setTimeout(function(){
                    Waypoint.refreshAll()
                },600);
            });
        },
        masonry: function() {

            var $grid = $('.masonry');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll());

        },
        mobileNav: function() {
            $('[data-target="mobile-nav"]').on('click', function(){
                $('body').toggleClass('mobile-nav-open');
                return false;
            });
        }
    },
    Components: {
        init: function() {  

            this.carousel();   
            this.modal(); 
            this.chart();
            this.progressBar();
            this.tooltip(); 
            this.popover();
            this.messenger();
            this.navToggleable();
            this.navFilter();

        },
        modal: function() {

            $('.modal').on('show.bs.modal', function () {
                $('body').addClass('modal-opened');
            });

            $('.modal').on('hide.bs.modal', function () {
                $('body').removeClass('modal-opened');
            });

        },
        chart: function() {

            $('.chart').each(function(){ 

                var size = $(this).data('size');

                $(this)
                    .easyPieChart({
                        barColor: $(this).data('bar-color'),
                        trackColor: $(this).data('track-color'),
                        scaleColor: $(this).data('scale-color'),
                        size: size,
                        lineWidth: $(this).data('line-width'),
                        animate: 1000,
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    })
                    .css({
                        'width': size+'px',
                        'height': size+'px'
                    })
                    .children('.percent').css('line-height',size+'px');

            });

            $('.chart').appear(function() {
                $(this).each(function(){
                    var $chart = $(this);
                    if (!$chart.hasClass('visible')) $chart.addClass('visible');
                    var value = $(this).data('value');
                    setTimeout(function(){
                        $chart.data('easyPieChart').update(value);
                    },200);
                });
            });
        },
        progressBar: function() {

            $('.progress-animated').appear(function() {
                var $bar = $(this).find('.progress-bar');
                $bar.each(function(){ 
                    setTimeout(function() {
                        var value = $bar.attr('aria-valuenow');
                        var i=0;
                        setInterval(function() {
                            i++;
                            if(i<=value) {
                                $bar.children('span').text(i+'%');
                            };
                        }, 15);
                        $bar.css('width',value+'%');
                    },300)
                });
            });
        },
        carousel: function() {
            $('.carousel').owlCarousel({
                items : $(this).data('items'),
                itemsDesktop : $(this).data('items-desktop'),
                itemsDesktopSmall : false,
                itemsTablet : $(this).data('items-tablet'),
                itemsMobile : $(this).data('items-mobile'),
                singleItem : $(this).data('single-item'),
                autoPlay : $(this).data('auto-play'),
                pagination : $(this).data('pagination'),
                stopOnHover: true
            });
        },
        tooltip: function() {
            $("[data-toggle='tooltip']").tooltip();
        },
        popover: function() {
            $("[rel='popover']").popover();
        },
        messenger: function() {
            $('[data-target="messenger"]').on('click',function(){
                var $messenger = $('#messenger'),
                    $messengerBox = $('#messenger-box');

                if($messenger.hasClass('active')) {
                    $messengerBox.find('.messenger-box-content').fadeOut();
                    $messenger.fadeOut(300).removeClass('active');
                } else {
                    $messenger.fadeIn(300, function(){
                        $messengerBox.find('.messenger-box-content').fadeIn(400);
                    }).addClass('active');
                }
                return false;
            });
        },
        navToggleable: function() {
            $('.nav-toggleable > li.dropdown > a').on('click', function(){
                $(this).parent('li').toggleClass('active');
                return false;
            })
        },
        navFilter: function() {
            var $navFiltering = $('.nav-filter');
            $navFiltering.on('click', 'a', function(){
                var $grid = $($(this).parents('.nav-filter').data('filter-grid'));
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                })
                $(this).parents('.nav').find('.active').removeClass('active');
                $(this).parent('li').addClass('active');
                return false;
            });
        }
    }
};

$(document).ready(function (){

    Mi.init();

});
