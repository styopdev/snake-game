export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export enum Level {
  easy = 3000,
  medium = 1500,
  hard = 500,
  legendary = 200,
}

export class Snake {
  direction: Direction;
  previousDirection: Direction;
  length: number;
  htmlElement: HTMLCollectionOf<Element>;
  snakeMap: number[][] = [];
  timer: Level;
  onCrash: Function;
  onEat: Function;
  
  constructor(d: Direction, l: number, h: HTMLCollectionOf<Element>, diff: Level, onCrash: Function, onAppleEat: Function) {
    this.direction = d;
    this.previousDirection = d;
    this.length = l;
    this.htmlElement = h;
    this.onCrash = onCrash;
    this.onEat = onAppleEat;
    this.timer = diff;

    let i = this.length;

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

  move() {
    let [x, y] = this.snakeMap[0] as Array<number>;
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

    const cellIndex = this.getCellIndex.bind(this)(0);

    this.checkForCrash.bind(this)(cellIndex);
    this.checkForApple.bind(this)(cellIndex);

    this.render.apply(this);
  }
  
  render() {
    for (const cell of <any>this.htmlElement) {
      cell.classList.remove('snake');
    }

    let i = this.snakeMap.length;
    
    while(i--) {
      const cellIndex = this.getCellIndex.bind(this)(i);
      this.htmlElement[cellIndex].classList.add('snake');
      this.htmlElement[cellIndex].classList.remove('snake-head');
    }
    this.htmlElement[this.getCellIndex(0)]?.classList.add('snake-head');
  }

  checkForCrash(cellIndex: number) {
    if (this.htmlElement[cellIndex]?.classList.contains('snake')) {
      this.onCrash();
    }
  }

  checkForApple(cellIndex: number) {
    if (!this.htmlElement[cellIndex]?.classList.contains('apple')) {
      return;
    }

    const [x, y] = this.snakeMap.at(-1) as [number, number];
    this.snakeMap.push([x, y]);

    this.length++;
    this.htmlElement[cellIndex].classList.remove('apple');

    this.createApple.apply(this);
    this.onEat();
  }

  getCellIndex(snakeMapIndex: number) {
    if (!this.snakeMap[snakeMapIndex]) {
      return 0;
    }
    const [x, y] = this.snakeMap[snakeMapIndex];

    return y * 10 + x;
  }

  changeDirection(newDirection: Direction) {
    if (
        newDirection === Direction.Right && this.direction === Direction.Left || 
        newDirection === Direction.Left && this.direction === Direction.Right ||
        newDirection === Direction.Up && this.direction === Direction.Down ||
        newDirection === Direction.Down && this.direction === Direction.Up
      ) {
      return;
    }

    this.previousDirection = this.direction;
    this.direction = newDirection;
  }

  createApple(): void {
    const randomIndex = Math.floor(Math.random() * 100);
  
    const headIndex = this.getCellIndex(0);
    if (this.htmlElement[randomIndex]?.classList.contains('snake') || headIndex === randomIndex) {
      return this.createApple.apply(this);
    }
    this.htmlElement[randomIndex]?.classList.add('apple');
  }
}

const cells = window.document.getElementsByClassName('cell');
const score = window.document.getElementById('score') || { innerHTML: 0 };
let interval: any;

const gameOver = () => {
  clearInterval(interval);
  alert('Game Over');
  window.location.reload();
};

const onAppleEat = () => {
  score.innerHTML = +score.innerHTML + 1;
}

const snake = new Snake(Direction.Right, 3, cells, Level.legendary, gameOver, onAppleEat);

window.onkeyup = (event) => {
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
