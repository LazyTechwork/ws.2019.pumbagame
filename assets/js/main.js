$(document).ready(function () {
    let startscreen = $('.screen-start');
    let instrscreen = $('.screen-instructions');
    let body = $('body');
    let video = $('video')[0];
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
    video.addEventListener('ended', function () {
        instrscreen.animate({left: '150%'});
    })
});
