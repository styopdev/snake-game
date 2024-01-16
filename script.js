"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snake = exports.Level = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (exports.Direction = Direction = {}));
var Level;
(function (Level) {
    Level[Level["easy"] = 3000] = "easy";
    Level[Level["medium"] = 1500] = "medium";
    Level[Level["hard"] = 500] = "hard";
    Level[Level["legendary"] = 200] = "legendary";
})(Level || (exports.Level = Level = {}));
var Snake = /** @class */ (function () {
    function Snake(d, l, h, diff, onCrash, onAppleEat) {
        this.snakeMap = [];
        this.direction = d;
        this.previousDirection = d;
        this.length = l;
        this.htmlElement = h;
        this.onCrash = onCrash;
        this.onEat = onAppleEat;
        this.timer = diff;
        var i = this.length;
        while (i--) {
            if (!this.htmlElement[i]) {
                continue;
            }
            this.snakeMap.push([i, 0]);
            this.htmlElement[i].classList.add('snake');
        }
        this.render.apply(this);
        this.createApple.apply(this);
    }
    Snake.prototype.move = function () {
        var _a = this.snakeMap[0], x = _a[0], y = _a[1];
        switch (this.direction) {
            case Direction.Right:
                x = x + 1;
                if (x > 0 && x % 10 === 0) {
                    return this.onCrash();
                }
                break;
            case Direction.Left:
                if (x % 10 <= 0) {
                    return this.onCrash();
                }
                x = x - 1;
                break;
            case Direction.Up:
                if (y % 10 === 0) {
                    return this.onCrash();
                }
                y = y - 1;
                break;
            case Direction.Down:
                y = y + 1;
                if (y > 0 && y % 10 === 0) {
                    return this.onCrash();
                }
                break;
            default:
                break;
        }
        this.snakeMap.unshift([x, y]);
        this.snakeMap.pop();
        var cellIndex = this.getCellIndex.bind(this)(0);
        this.checkForCrash.bind(this)(cellIndex);
        this.checkForApple.bind(this)(cellIndex);
        this.render.apply(this);
    };
    Snake.prototype.render = function () {
        var _a;
        for (var _i = 0, _b = this.htmlElement; _i < _b.length; _i++) {
            var cell = _b[_i];
            cell.classList.remove('snake');
        }
        var i = this.snakeMap.length;
        while (i--) {
            var cellIndex = this.getCellIndex.bind(this)(i);
            this.htmlElement[cellIndex].classList.add('snake');
            this.htmlElement[cellIndex].classList.remove('snake-head');
        }
        (_a = this.htmlElement[this.getCellIndex(0)]) === null || _a === void 0 ? void 0 : _a.classList.add('snake-head');
    };
    Snake.prototype.checkForCrash = function (cellIndex) {
        var _a;
        if ((_a = this.htmlElement[cellIndex]) === null || _a === void 0 ? void 0 : _a.classList.contains('snake')) {
            this.onCrash();
        }
    };
    Snake.prototype.checkForApple = function (cellIndex) {
        var _a;
        if (!((_a = this.htmlElement[cellIndex]) === null || _a === void 0 ? void 0 : _a.classList.contains('apple'))) {
            console.log('no apple');
            return;
        }
        console.log('yes apple');
        var _b = this.snakeMap.at(-1), x = _b[0], y = _b[1];
        this.snakeMap.push([x, y]);
        this.length++;
        console.log(this.length);
        this.htmlElement[cellIndex].classList.remove('apple');
        this.createApple.apply(this);
        this.onEat();
    };
    Snake.prototype.getCellIndex = function (snakeMapIndex) {
        if (!this.snakeMap[snakeMapIndex]) {
            return 0;
        }
        var _a = this.snakeMap[snakeMapIndex], x = _a[0], y = _a[1];
        return y * 10 + x;
    };
    Snake.prototype.changeDirection = function (newDirection) {
        if (newDirection === Direction.Right && this.direction === Direction.Left ||
            newDirection === Direction.Left && this.direction === Direction.Right ||
            newDirection === Direction.Up && this.direction === Direction.Down ||
            newDirection === Direction.Down && this.direction === Direction.Up) {
            return;
        }
        this.previousDirection = this.direction;
        this.direction = newDirection;
    };
    Snake.prototype.createApple = function () {
        var _a, _b;
        var randomIndex = Math.floor(Math.random() * 100);
        var headIndex = this.getCellIndex(0);
        if (((_a = this.htmlElement[randomIndex]) === null || _a === void 0 ? void 0 : _a.classList.contains('snake')) || headIndex === randomIndex) {
            return this.createApple.apply(this);
        }
        (_b = this.htmlElement[randomIndex]) === null || _b === void 0 ? void 0 : _b.classList.add('apple');
    };
    return Snake;
}());
exports.Snake = Snake;
var cells = window.document.getElementsByClassName('cell');
var score = window.document.getElementById('score') || { innerHTML: 0 };
var interval;
var gameOver = function () {
    clearInterval(interval);
    alert('Game Over');
    window.location.reload();
};
var onAppleEat = function () {
    score.innerHTML = +score.innerHTML + 1;
};
var snake = new Snake(Direction.Right, 3, cells, Level.legendary, gameOver, onAppleEat);
window.onkeyup = function (event) {
    if (event.key === 'ArrowRight') {
        snake.changeDirection(Direction.Right);
    }
    if (event.key === 'ArrowLeft') {
        snake.changeDirection(Direction.Left);
    }
    if (event.key === 'ArrowUp') {
        snake.changeDirection(Direction.Up);
    }
    if (event.key === 'ArrowDown') {
        snake.changeDirection(Direction.Down);
    }
};
interval = setInterval(snake.move.bind(snake), snake.timer);
