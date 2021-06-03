class Game {
    constructor() {
        var gameDiv;
        var nextDiv;
        var timeDiv;
        var scoreDiv;
        var score = 0;
        var resultDiv;
        var gameData = Array.from({ length: config.rows }).map((o) => {
            return Array.from({ length: config.columns }).map((o) => 0);
        });
        let previewData = [];
        var cur;
        var next;
        var nextDivs = [];
        var gameDivs = [];
        var initDiv = function (container, data, divs) {
            for (var i = 0; i < data.length; i++) {
                var div = [];
                for (var j = 0; j < data[0].length; j++) {
                    var newNode = document.createElement("div");
                    newNode.className = "none";
                    newNode.style.width = config.blockSize + "px";
                    newNode.style.height = config.blockSize + "px";
                    newNode.style.top = config.divider + i * (config.blockSize + config.divider) + "px";
                    newNode.style.left = config.divider + j * (config.blockSize + config.divider) + "px";
                    container.appendChild(newNode);
                    div.push(newNode);
                }
                divs.push(div);
            }
        };
        var refashDiv = function (data, divs) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    if (data[i][j] == 0) {
                        divs[i][j].className = "none";
                    } else if (data[i][j] == 1) {
                        divs[i][j].className = "done";
                    } else if (data[i][j] == 2) {
                        divs[i][j].className = "current";
                    } else if (data[i][j] == 3) {
                        divs[i][j].className = "current preview";
                    }
                }
            }
        };
        var isValid = function (pos, data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    if (data[i][j] != 0) {
                        if (!check(pos, i, j)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        var check = function (pos, x, y) {
            if (pos.x + x < 0) {
                return false;
            } else if (pos.x + x >= gameData.length) {
                return false;
            } else if (pos.y + y < 0) {
                return false;
            } else if (pos.y + y >= gameData[0].length) {
                return false;
            } else if (gameData[pos.x + x][pos.y + y] == 1) {
                return false;
            } else {
                return true;
            }
        };
        var cleanData = function () {
            clearPreviewData();
            for (var i = 0; i < cur.data.length; i++) {
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (check(cur.origin, i, j)) gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        };
        var setData = function () {
            for (var i = 0; i < cur.data.length; i++) {
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (check(cur.origin, i, j)) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                    }
                }
            }
            setPerviewData();
        };
        const clearPreviewData = () => {
            previewData.forEach((item) => {
                if (gameData[item.x][item.y] == 3) {
                    gameData[item.x][item.y] = 0;
                }
            });
            previewData = [];
        };
        const setPerviewData = () => {
            if (!cur) {
                return;
            }
            var test = { x: cur.origin.x, y: cur.origin.y };
            while (isValid(test, cur.data)) {
                test.x += 1;
            }
            test.x -= 1;
            for (var i = 0; i < cur.data.length; i++) {
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (check(test, i, j) && gameData[test.x + i][test.y + j] == 0 && cur.data[i][j] == 2) {
                        gameData[test.x + i][test.y + j] = 3;
                        previewData.push({ x: test.x + i, y: test.y + j });
                    }
                }
            }
        };
        var rotate = function () {
            if (cur.canRotate(isValid)) {
                cleanData();
                cur.rotate();
                setData();
                refashDiv(gameData, gameDivs);
            }
        };
        var down = (fall = false) => {
            if (cur.canDown(isValid)) {
                cleanData();
                cur.down();
                setData();
                refashDiv(gameData, gameDivs);
                return true;
            } else {
                if (fall && !checkGameOver()) {
                    this.onFallEnd && this.onFallEnd();
                }
                return false;
            }
        };
        var fall = function () {
            while (down(true)) {}
        };
        var left = function () {
            if (cur.canLeft(isValid)) {
                cleanData();
                cur.left();
                setData();
                refashDiv(gameData, gameDivs);
            }
        };
        var right = function () {
            if (cur.canRight(isValid)) {
                cleanData();
                cur.right();
                setData();
                refashDiv(gameData, gameDivs);
            }
        };
        var fixed = function () {
            for (var i = 0; i < cur.data.length; i++) {
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (check(cur.origin, i, j)) {
                        if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                            gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                        }
                    }
                }
            }
            refashDiv(gameData, gameDivs);
        };
        var preformNext = function (type, dir) {
            cur = next;
            setData();
            next = SquareFactory.prototype.make(type, dir);
            refashDiv(gameData, gameDivs);
            refashDiv(next.data, nextDivs);
        };
        var checkClear = function () {
            var clearLine = 0;
            for (var i = gameData.length - 1; i >= 0; i--) {
                var clear = true;
                for (var j = 0; j < gameData[0].length; j++) {
                    if (gameData[i][j] != 1) {
                        clear = false;
                        break;
                    }
                }
                if (clear) {
                    clearLine = clearLine + 1;
                    for (var m = i; m > 0; m--) {
                        for (var n = 0; n < gameData[0].length; n++) {
                            gameData[m][n] = gameData[m - 1][n];
                        }
                    }
                    for (var n = 0; n < gameData[0].length; n++) {
                        gameData[0][n] = 0;
                    }
                    i++;
                }
            }
            return clearLine;
        };
        var checkGameOver = function () {
            var gameOver = false;
            for (var i = 0; i < gameData[0].length; i++) {
                if (gameData[1][i] == 1) {
                    gameOver = true;
                }
            }
            return gameOver;
        };
        var setTime = function (time) {
            timeDiv.innerHTML = time;
        };
        var addSocre = function (line) {
            var s = 0;
            switch (line) {
                case 1:
                    s = 10;
                    break;
                case 2:
                    s = 30;
                    break;
                case 3:
                    s = 60;
                    break;
                case 4:
                    s = 100;
                    break;
                default:
                    break;
            }
            score = score + s;
            scoreDiv.innerHTML = score;
        };
        var gameOver = (win) => {
            if (win) {
                resultDiv.innerHTML = "you win";
            } else {
                resultDiv.innerHTML = "you lost";
            }
        };
        var addTailLines = function (lines) {
            clearPreviewData();
            for (var i = 0; i < gameData.length - lines.length; i++) {
                gameData[i] = gameData[i + lines.length];
            }
            for (var i = 0; i < lines.length; i++) {
                gameData[gameData.length - lines.length + i] = lines[i];
            }
            cur.origin.x = cur.origin.x - lines.length;
            if (cur.origin.x < 0) {
                cur.origin.x = 0;
            }
            refashDiv(gameData, gameDivs);
        };
        var init = function (doms, type, dir) {
            gameDiv = doms.gameDiv;
            nextDiv = doms.nextDiv;
            timeDiv = doms.timeDiv;
            scoreDiv = doms.scoreDiv;
            resultDiv = doms.resultDiv;
            next = SquareFactory.prototype.make(type, dir);
            initDiv(gameDiv, gameData, gameDivs);
            initDiv(nextDiv, next.data, nextDivs);
            refashDiv(next.data, nextDivs);
        };
        this.init = init;
        this.down = down;
        this.right = right;
        this.left = left;
        this.rotate = rotate;
        this.fall = fall;
        this.fixed = fixed;
        this.preformNext = preformNext;
        this.checkClear = checkClear;
        this.checkGameOver = checkGameOver;
        this.setTime = setTime;
        this.addSocre = addSocre;
        this.gameOver = gameOver;
        this.addTailLines = addTailLines;
        this.onFallEnd = null;
    }
}
