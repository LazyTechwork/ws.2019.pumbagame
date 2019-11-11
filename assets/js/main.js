let startscreen = $('.screen-start');
let instrscreen = $('.screen-instructions');
let resultsscreen = $('.screen-results');
let body = $('body');
let video = $('video')[0];
$(document).ready(function () {
    startscreen.animate({left: '50%'});
    $('#entername').submit((e) => {
        e.preventDefault();
        startscreen.animate({left: '150%'}, {
            complete: () => {
                instrscreen.animate({left: '50%'}, {complete: () => video.play()});
                body.animate({background: '#000000'});
            }
        });
    });
    video.addEventListener('ended', () => skipVideo());
    $('.skipvideo').click(() => skipVideo());
});

function skipVideo() {
    video.pause();
    instrscreen.animate({top: '150%'});
    resultsscreen.animate({left: '50%'});
}