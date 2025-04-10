$(document).ready(function () {
    window.onload = function () {
        setTimeout(function () {
            const introVideo = document.getElementById('introVideo');
            if (introVideo) {
                introVideo.play();
            }
        }, 2000);
    };

    let isVideoPlaying = false;
    let currentVideo = null;

    $('header').css({
        'transform': 'translateY(-100%)',
        'transition': 'none',
        'opacity': '0'
    });

    $('#jsm').fullpage({
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7'],
        responsiveWidth: 768,
        scrollBar: true,

        onLeave: function (origin, destination, direction) {
            if (destination.index === 0) {
                $('header').css({
                    'transform': 'translateY(-100%)',
                    'transition': 'transform 1s ease-in-out, opacity 1s ease-in-out',
                    'opacity': '0'
                });
            } else {
                $('header').css({
                    'transform': 'translateY(0)',
                    'transition': 'transform 1s ease-in-out, opacity 1s ease-in-out',
                    'opacity': '1'
                });
            }
        },

        afterLoad: function (anchorLink, index) {
            if (index === 1) {
                $('header').css({
                    'transition': 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                    'transform': 'translateY(-100%)',
                    'opacity': '0'
                });
            } else {
                setTimeout(function () {
                    $('header').css({
                        'transition': 'transform 0.2s, opacity 0.2s',
                        'transform': 'translateY(0)',
                        'opacity': '1'
                    });
                }, 1);
            }
        }
    });

    // ✅ 영상 클릭 이벤트
    function handleVideoClick(className, shiftValues) {
        $(className).click(function (event) {
            event.stopPropagation();

            let video = $(this).find('video')[0];

            if ($(window).width() <= 768) {
                // 📱 모바일에선 이동/확대 없이 그냥 재생만
                video.play();
                return;
            }

            if (isVideoPlaying && currentVideo !== this) {
                resetVideos();
            }

            $(this).addClass('on');
            video.play();

            // PC 전용: 나머지 영상 밀기
            for (let i = 1; i < parseInt(className[3]); i++) {
                $(`.ve${i}`).css('transform', `translateX(${shiftValues[i - 1]})`);
            }

            currentVideo = this;
            isVideoPlaying = true;
        });
    }

    handleVideoClick('.ve1', []);
    handleVideoClick('.ve2', ['-150%']);
    handleVideoClick('.ve3', ['-150%', '-250%']);
    handleVideoClick('.ve4', ['-150%', '-250%', '-350%']);
    handleVideoClick('.ve5', ['-150%', '-250%', '-350%', '-450%']);

    // ❌ ESC나 클릭하면 초기화
    $(document).keydown(function (event) {
        if (event.key === "Escape") {
            resetVideos();
        }
    });

    $(document).click(function (event) {
        if (!$(event.target).closest('.ve1, .ve2, .ve3, .ve4, .ve5').length) {
            resetVideos();
        }
    });

    function resetVideos() {
        $('.ve1, .ve2, .ve3, .ve4, .ve5')
            .removeClass('on')
            .find('video').each(function () {
                this.pause();
                this.currentTime = 0;
            });

        $('.ve1, .ve2, .ve3, .ve4, .ve5').css('transform', '');

        isVideoPlaying = false;
        currentVideo = null;
    }

    // ✅ 스크롤 등장 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.fade-item').forEach(el => observer.observe(el));
});
