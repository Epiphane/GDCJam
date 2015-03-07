function InGame() {
    // Initial variables
    this.speed = 350;
    this.UI_PADDING = 50;
    this.SCORE_TO_WIN = 5;

    var initialSize = { w: 20, h: 140 };

    this.portals = false;
    this.portal1 = {x: 0, y: 0, width: 0};
    this.portal2 = {x: 0, y: 0, width: 0};
    this.shape1 = null;
    this.shape2 = null;

    this.expPerHit = 25;
    this.expPerWin = 50;
    this.experience = [0, 0];
    this.score = [0, 0];
    this.expWidth = [0, 0];

    this.shake = 0;

    this.juiceLevel = 0;
    this.juice = {};

    this.background = new Image();
    // this.background.src = "http://placekitten.com/g/1024/768";
    this.background.src = "./asset/juice.png";

    this.players = [new Player(0), new Player(1)];

    var distFromEdge = 30;
    this.players[0].setX(distFromEdge);
    this.players[1].setX(GAME_WIDTH - distFromEdge - this.players[1].getWidth());
    this.players[0].setY(GAME_HEIGHT / 2 - this.players[0].getHeight() / 2);
    this.players[1].setY(GAME_HEIGHT / 2 - this.players[1].getHeight() / 2);
    this.ball = new Ball(GAME_WIDTH / 2, GAME_HEIGHT / 2, null, this.speed);

    // Draw UI offscreen so that text isn't rerendered every frame
    this.scoreLabels = [
        renderText('0', '34pt Poiret One', 'white'),
        renderText('0', '34pt Poiret One', 'white')
    ];

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    this.grds = {
        exp: context.createLinearGradient(0.000, 150.000, GAME_WIDTH / 2 - 100, 150.000),
        shield: context.createLinearGradient(0.000, 150.000, 10.000, 150.000)
    };

    // Create EXP bar
    this.grds.exp.addColorStop(0.000, 'rgba(0, 255, 0, 1.000)');
    this.grds.exp.addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
    this.grds.exp.addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
    this.grds.exp.addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');

    // Create shield
    this.grds.shield.addColorStop(0.000, 'rgba(86, 170, 255, 1.000)');
    this.grds.shield.addColorStop(1.000, 'rgba(0, 0, 0, 0.000)');
}

InGame.prototype.setJuiceAndAdd = function() {
    this.ball.juice = {
        color: false,
        trail: false,
        bounce: false,
        speedup: true,
        sound: false
    };

    this.players[0].juice = this.players[1].juice = {
        color: false,
        bounce: false
    };

    this.juice = {
        expBarColor: false,
        countdown: false
    };

    this.expPerHit = 25;
    this.expPerWin = 50;

    switch (this.juiceLevel) {
        case 8:
            this.juice.background = this.background;
        case 7:
        case 6:
        case 5:
            this.ball.juice.color = true;
        case 4:
            this.juice.countdown = true;
        case 3:
            this.juice.expBarColor = true;
        case 2:
            this.ball.juice.trail = true;
            this.players[0].juice.bounce = true;
            this.players[1].juice.bounce = true;
        case 1:
            this.expPerHit = 10;
            this.expPerWin = 40;
            this.players[0].juice.shake = true;
            this.ball.juice.sound = true;
        case 0:
            this.players[0].juice.color = true;
            this.players[1].juice.color = true;
            this.ball.juice.bounce = true;
            break;
        default:
            this.ball.juice.color = true;
            this.juice.countdown = true;
            this.juice.expBarColor = true;
            this.ball.juice.trail = true;
            this.players[0].juice.bounce = true;
            this.players[1].juice.bounce = true;
            this.expPerHit = 10;
            this.expPerWin = 40;
            this.ball.juice.sound = true;
            this.players[0].juice.color = true;
            this.players[1].juice.color = true;
            this.ball.juice.bounce = true;
    }

    this.juiceLevel ++;
};

InGame.prototype.init = function() {
    var distFromEdge = 20;

    // "Entities"
    this.players[0].setX(distFromEdge);
    this.players[1].setX(GAME_WIDTH - distFromEdge - this.players[1].getWidth());
    this.players[0].setY(GAME_HEIGHT / 2 - this.players[0].getHeight() / 2);
    this.players[1].setY(GAME_HEIGHT / 2 - this.players[1].getHeight() / 2);
    this.ball = new Ball(GAME_WIDTH / 2, GAME_HEIGHT / 2, null, this.speed);

    this.countdown = 4000;
    this.numSoundsToPlay = 3;

    this.setJuiceAndAdd();
};

InGame.prototype.giveExperience = function(player, exp) {
    this.experience[player] += (exp || this.expPerHit);

    if (this.experience[player] >= 100) {
        if (exp) // This means that it's after one player "won"
            this.game.setState(new PowerupScreen(this, player));
        else
            this.game.setState(new PowerupScreen(this, player, true));

        this.experience[player] -= 100;
    }
};

InGame.prototype.shakeScreen = function() {
    this.shake = 20;
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function(dt) {
    if (this.countdown) {
        this.countdown -= Math.floor(dt * 500);

        if (this.countdown <= 0) {
            this.countdown = 0;
            this.pause = false;
        }
    }
    else {
        this.players[0].update(dt);
        this.players[1].update(dt);
        this.ball.update(dt, this);

        if (this.ball.win) {
            if (this.ball.win === 1) {
                this.score[0]++;

                var ctx = this.scoreLabels[0].getContext('2d');
                ctx.clearRect(0, 0, this.scoreLabels[0].width, this.scoreLabels[0].height);
                ctx.fillText(this.score[0], 0, 0);

                if (this.score[0] >= this.SCORE_TO_WIN)
                    this.game.setState(new GameOverScreen(this.players[0]));
                else
                    this.giveExperience(0, this.expPerWin);
            }
            else {
                this.score[1]++;

                var ctx = this.scoreLabels[1].getContext('2d');
                ctx.clearRect(0, 0, this.scoreLabels[1].width, this.scoreLabels[1].height);
                ctx.fillText(this.score[1], 0, 0);

                if (this.score[1] >= this.SCORE_TO_WIN)
                    this.game.setState(new GameOverScreen(this.players[1]));
                else
                    this.giveExperience(1, this.expPerWin);
            }

            this.uiNeedsUpdate = true;
            this.pause = true;
            this.init();
        }
    }
};

InGame.prototype.drawExperiences = function(context) {
    if (this.juice.expBarColor) {
        context.fillStyle = this.grds.exp;
    }
    else {
        context.fillStyle = "rgba(100, 100, 100, 1)";
    }

    var expBarHeight = 23;
    var expBarWidth = GAME_WIDTH / 2 - (2 * this.UI_PADDING + 75);

    var boxMargin = 5;
    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineWidth = 3;

    for(var i = 0; i < 2; i ++) {
        // Fill with gradient but not more than 100%
        var diff = (this.experience[i] > 100 ? 100 : this.experience[i]) - this.expWidth[i];
        this.expWidth[i] += diff / 7;

        // For player 1, flip the canvas
        if (i === 1) {
            context.save();
            context.scale(-1, 1);
            context.translate(-GAME_WIDTH, 0);
        }

        context.fillRect(this.UI_PADDING, this.UI_PADDING, 
                         expBarWidth * this.expWidth[i] / 100, 
                         expBarHeight);
        // Draw the gray box around em
        context.strokeRect(this.UI_PADDING - boxMargin, this.UI_PADDING - boxMargin,
                           expBarWidth + 2 * boxMargin,
                           expBarHeight + 2 * boxMargin);

        if (i === 1) {
            context.restore();
        }
    }
};

InGame.prototype.render = function(context) {
    if (this.shake) {
        context.save();
        context.translate(Math.sin(this.shake) * this.shake / 4, 0);
    }

    // Draw the background first
    var x = Math.floor(GAME_WIDTH / 2 - this.background.width / 2);
    var y = Math.floor(GAME_HEIGHT / 2 - this.background.height / 2);

    // Redraw this
    // context.clearRect(x, y, Math.floor(this.juice.background.width), Math.floor(this.juice.background.height));
    
    context.drawImage(this.background, x, y,
        Math.floor(this.background.width), Math.floor(this.background.height));

    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(x, y, Math.floor(this.background.width), Math.floor(this.background.height));

    // Draw shields
    for (var p = 0; p <= 1; p ++) {
        if (this.players[p].hasPowerup(Shield)) {
            context.save();
            if (p === 1) {
                context.scale(-1, 1);
                context.translate(-GAME_WIDTH, 0);
            }

            context.fillStyle = this.grds.shield;
            context.fillRect(0, 0, 10, GAME_HEIGHT);

            context.restore();
        }
    }
    
    // Draw experience bar
    this.drawExperiences(context);

    var scoreDist = this.UI_PADDING;
    context.drawImage(this.scoreLabels[0], GAME_CENTER.x - scoreDist - this.scoreLabels[0].width / 2, this.UI_PADDING - 10);
    context.drawImage(this.scoreLabels[1], GAME_CENTER.x + scoreDist - this.scoreLabels[1].width / 2, this.UI_PADDING - 10);

    if (this.portals) {
        context.fillStyle = "blue";
        context.fillRect(this.portal1.x, this.portal1.y, this.ball.getSize() + 10, 100);
        context.fillStyle = "orange";
        context.fillRect(this.portal2.x, this.portal2.y, this.ball.getSize() + 10, 100);
    }

    this.players[0].draw(context);
    this.players[1].draw(context);

    this.ball.draw(context);

    // Draw countdown
    if (this.countdown > 200) {
        if (this.countdown < 4000) {
            var seconds = Math.floor(this.countdown / 1000);
            if (this.numSoundsToPlay >= seconds) {
                this.numSoundsToPlay == 0 ? startSound2.play() : startSound1.play();
                this.numSoundsToPlay = this.numSoundsToPlay - 1;
            }

            var text;
            if (this.countdown > 1000)
                text = seconds.toString();
            else
                text = 'GO!';

            var timeToNext = (this.countdown % 1000) / 1000;
            var maxSize = 600;
            var fontSize = maxSize - maxSize * timeToNext;

            if (!this.juice.countdown)
                fontSize = 200;

            context.fillStyle = "rgba(255, 255, 255, " + 2 * timeToNext * (1 - timeToNext) + ")";
            context.font = fontSize + "pt Arial Black";
            var textSize = context.measureText(text);
            context.fillText(text, (GAME_WIDTH / 2) - (textSize.width / 2),
                    (GAME_HEIGHT / 2) + fontSize / 2);
        }
    }

    if (this.shake) {
        context.restore();
        this.shake --;
    }
};
