let startscreen = $('.screen-start');
let instrscreen = $('.screen-instructions');
let resultsscreen = $('.screen-results');
let gamescreen = $('.gamescreen');
let body = $('body');
let video = $('video')[0];
let nick = '';
let game = null;
$(document).ready(function () {
    startscreen.animate({left: '50%'});
    $('#entername').submit((e) => {
        e.preventDefault();
        let nicknameel = $('input#name');
        if (!nicknameel.val()) {
            nicknameel.addClass('shake');
            setTimeout(() => nicknameel.removeClass('shake'), 1000);
            return;
        }
        nick = nicknameel.val();
        startscreen.animate({left: '150%'}, {
            complete: () => {
                instrscreen.animate({left: '50%'}, {complete: () => video.play()});
                body.animate({background: '#000000'});
            }
        });
        $('#entername button').blur();
    });
    video.addEventListener('ended', () => skipVideo());
    $('.skipvideo').click(() => skipVideo());
    $(document).on('keydown', function (ev) {
        if (game === null)
            return;
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
    $('.animateByJump').each((iii, el) => {
        el = $(el);
        let text = el.text();
        text = text.split('');
        text.forEach((textt, i) => text[i] = textt === ' ' ? ' ' : '<span>' + textt + '</span>');
        el.html(text);
        el.children('span').each((i, ell) => setTimeout(() => $(ell).addClass('jump'), 200 * i));
    });
});

function random(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function skipVideo() {
    video.pause();
    instrscreen.animate({top: '150%'});
    gamescreen.fadeIn(400, () => game = new Game(nick));
    $('.skipvideo').blur();
    // resultsscreen.animate({left: '50%'});
}

class Game {
    constructor(playername) {
        this.player = new Player(this, 20, 0, 0);
        this.frames = 0;
        this.time = 0;
        this.timeel = $('.timer span');
        this.hpel = $('.hpbar span');
        this.nickel = $('.nickname span');
        this.cppos = random(20, window.innerWidth);
        this.cp = $('.caterpillar');
        this.cpimg = this.cp.children('img');
        this.cpwidth = this.cpimg.width();
        this.cpheight = this.cpimg.height();
        this.iscpate = false;
        this.playerspeed = 10;
        this.playername = playername;
        this.keys = {
            left: false,
            right: false,
            space: false
        };
        this.renderStatusbars();
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.frames++;
        if (this.frames % 60 === 0) {
            this.frames = 0;
            this.time++;
            this.player.hp -= 1;

            if (this.player.hp <= 0)
                this.player.hp = 100;
            this.renderStatusbars();
        }
        if (this.iscpate) {
            this.cppos = random(20, window.innerWidth);
            this.iscpate = false;
        }
        if (this.keys.right) {
            this.player.x += this.playerspeed;
            this.player.elimg.css({transform: 'scaleX(1)'});
        }
        if (this.keys.left) {
            this.player.x -= this.playerspeed;
            this.player.elimg.css({transform: 'scaleX(-1)'});
        }
        if (this.keys.space && !game.player.isInFly && !game.player.isInFall)
            game.player.isInFly = true;
        let iscollides = false;
        for (let i = this.player.x; i <= this.player.x + this.player.width; i++) {
            iscollides = i === this.cppos;
            if (iscollides) {
                console.log(i);
                break;
            }
        }

        if (iscollides) {
            this.iscpate = true;
            this.player.hp += 10;
        }
        this.player.render();
        this.cp.css({left: this.cppos});
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

        this.nickel.html(this.playername);
    }
}

class Player {
    constructor(game, x, y, type) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        this.el = $('.player');
        this.elimg = $('.player img');
        this.width = this.elimg.width();
        this.height = this.elimg.height();
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
        if (this.x < 20) {
            this.x = 20;
            body.css({backgroundPositionX: '+=' + this.game.playerspeed});
            this.game.cppos += this.game.playerspeed;
        }
        if (this.x > window.innerWidth / 2 - 50 - (this.elimg.width() / 2)) {
            this.x = window.innerWidth / 2 - 50 - (this.elimg.width() / 2);
            body.css({backgroundPositionX: '-=' + this.game.playerspeed});
            this.game.cppos -= this.game.playerspeed;
        }
        this.el.css({left: (this.x) + 'px', bottom: (this.y + 25) + 'px'});
    }
}
