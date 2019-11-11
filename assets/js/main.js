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
        console.log(game.keys);
        if (ev.key === 'ArrowRight' || ev.key === 'd')
            game.keys.right = true;
        if (ev.key === 'ArrowLeft' || ev.key === 'a')
            game.keys.left = true;
        if (ev.key === 'ArrowUp' || ev.key === ' ')
            game.keys.space = true;
    });
    $(document).on('keyup', function (ev) {
        if (game === null)
            return;
        if (ev.key === 'ArrowRight' || ev.key === 'd')
            game.keys.right = false;
        if (ev.key === 'ArrowLeft' || ev.key === 'a')
            game.keys.left = false;
        if (ev.key === 'ArrowUp' || ev.key === ' ')
            game.keys.space = false;
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
        this.player = new Player(this, 0, 0, 0);
        this.frames = 0;
        this.time = 0;
        this.timeel = $('.timer span');
        this.hpel = $('.hpbar span');
        this.playerspeed = 10;
        this.keys = {
            left: false,
            right: false,
            space: false
        };
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
        if (this.keys.right)
            this.player.x += this.playerspeed;
        if (this.keys.left)
            this.player.x -= this.playerspeed;
        if (this.keys.space && !game.player.isInFly && !game.player.isInFall)
            game.player.isInFly = true;

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
    constructor(game, x, y, type) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        this.el = $('.player');
        this.hp = 100;
        this.isInFly = false;
        this.isInFall = false;
    }

    render() {
        if (this.isInFly)
            if (this.y >= 250) {
                this.y = 250;
                this.isInFly = false;
                this.isInFall = true;
            } else
                this.y += this.game.playerspeed;
        else if (this.isInFall)
            if (this.y <= 0) {
                this.y = 0;
                this.isInFall = this.isInFly = false;
            } else {
                this.y -= this.game.playerspeed;
            }
        this.el.css({left: (this.x + 20) + 'px', bottom: (this.y + 25) + 'px'});
    }
}
