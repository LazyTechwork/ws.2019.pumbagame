let startscreen = $('.screen-start');
let instrscreen = $('.screen-instructions');
let resultsscreen = $('.screen-results');
let body = $('body');
let video = $('video')[0];
let game = null;
$(document).ready(function () {
    // startscreen.animate({left: '50%'});
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
    $(document).on('keydown', function (ev) {
        if (game === null)
            return;
        switch (ev.key) {
            case 'ArrowRight':
                game.player.x += 10;
                break;
            case 'ArrowLeft':
                game.player.x -= 10;
                break;
        }
    });
    game = new Game();
});

function skipVideo() {
    video.pause();
    instrscreen.animate({top: '150%'});
    game = new Game();
    // resultsscreen.animate({left: '50%'});
}

class Game {
    constructor() {
        this.player = new Player(0, 0, 0);
        this.frames = 0;
        this.time = 0;
        this.timeel = $('.timer span');
        this.hpel = $('.hpbar span');
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.frames++;
        if (this.frames % 60 === 0) {
            this.frames = 0;
            this.time++;
            this.player.hp -= 1;
            this.renderStatusbars();
        }
        this.player.render();
        requestAnimationFrame(() => this.loop());
    }

    renderStatusbars() {
        let minutes = Math.floor(this.time / 60);
        let seconds = Math.floor(this.time % 60);
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        this.timeel.html(minutes + ':' + seconds);

        this.hpel.html(this.player.hp + "HP");
        this.hpel.animate({width: this.player.hp + "%"});
    }
}

class Player {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.el = $('.player');
        this.hp = 100;
    }

    render() {
        this.el.css({left: (this.x + 20) + 'px', bottom: (this.y + 25) + 'px'});
    }
}
