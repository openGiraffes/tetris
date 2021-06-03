class Local {
    constructor() {
        var game;
        var INERVAL = 200;
        var timer = null;
        var timeCount = 0;
        var time = 0;
        var bindKeyEvent = function () {
            document.activeElement.addEventListener("keydown", function (e) {
                if (e.key != "EndCall") e.preventDefault();
                switch (e.key) {
                    case "F1":
                    case "SoftLeft":
                        location.reload();
                        break;
                    case "ArrowUp":
                        game.rotate();
                        break;
                    case "ArrowDown":
                        game.down();
                        break;
                    case "Enter":
                        game.fall();
                        break;
                    case "ArrowRight":
                        game.right();
                        break;
                    case "ArrowLeft":
                        game.left();
                        break;
                    case "Backspace":
                        if (confirm("是否退出？")) window.close();
                        break;
                    case "#":
                        alert("请用方向键和确认键进行操作，上->旋转 下->坠落 左->左移 右->右移动");
                        break;
                }
            });
        };
        var move = function () {
            timeFunc();
            if (!game.down()) {
                game.fixed();
                var line = game.checkClear();
                if (line) {
                    game.addSocre(line);
                }
                if (game.checkGameOver()) {
                    game.gameOver(false);
                    stop();
                } else {
                    game.preformNext(generateType(), generateDir());
                }
            }
        };
        var generateBottomLine = function (lineNum) {
            var lines = [];
            for (var i = 0; i < lineNum; i++) {
                var line = [];
                for (var j = 0; j < 10; j++) {
                    line.push(Math.ceil(Math.random() * 2) - 1);
                }
                lines.push(line);
            }
            return lines;
        };
        var timeFunc = function () {
            timeCount = timeCount + 1;
            if (timeCount == 5) {
                timeCount = 0;
                time = time + 1;
                game.setTime(time);
                if (time % 10 == 0) game.addTailLines(generateBottomLine(1));
            }
        };
        var generateType = function () {
            return Math.ceil(Math.random() * 7) - 1;
        };
        var generateDir = function () {
            return Math.ceil(Math.random() * 4) - 1;
        };
        var start = function () {
            var dom = {
                gameDiv: document.getElementById("local_game"),
                nextDiv: document.getElementById("local_next"),
                timeDiv: document.getElementById("local_time"),
                scoreDiv: document.getElementById("local_score"),
                resultDiv: document.getElementById("local_gameover"),
            };

            dom.gameDiv.style.width = config.columns * (config.blockSize + config.divider) + config.divider;
            dom.gameDiv.style.height = config.rows * (config.blockSize + config.divider) + config.divider;

            dom.nextDiv.style.width = 4 * (config.blockSize + config.divider) + config.divider;
            dom.nextDiv.style.height = 4 * (config.blockSize + config.divider) + config.divider;

            game = new Game();
            game.init(dom, generateType(), generateDir());
            bindKeyEvent();
            game.preformNext(generateType(), generateDir());
            timer = setInterval(move, INERVAL);
        };
        var stop = function () {
            if (timer) {
                clearInterval(timer);
                document.onkeydown = null;
            }
        };
        this.start = start;
    }
}
