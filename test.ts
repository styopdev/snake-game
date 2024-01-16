import { Direction, Snake } from './script.js';

// Test the constructor
describe('Snake constructor', () => {
    it('should create a new Snake object', () => {
        // Given
        const direction: Direction = Direction.Right;
        const length: number = 3;
        const htmlElement: HTMLCollection<HTMLElement> = [];
        const diff: Level = Level.medium;
        const onCrash = () => {};
        const onAppleEat = () => {};

        // When
        const snake = new Snake(direction, length, htmlElement, diff, onCrash, onAppleEat);

        // Then
        expect(snake).toBeInstanceOf(Snake);
        expect(snake.direction).toEqual(direction);
        expect(snake.length).toEqual(length);
        expect(snake.htmlElement).toEqual(htmlElement);
        expect(snake.onCrash).toBe(onCrash);
        expect(snake.onEat).toBe(onAppleEat);
    });

    it('should throw an error for invalid direction', () => {
        // Given
        const direction = 'Invalid'; // Invalid direction
        const length: number = 3;
        const htmlElement = [];
        const diff = Level.medium;
        const onCrash = () => {};
        const onAppleEat = () => {};

        // When
        expect(() => new Snake(direction as any as, length, htmlElement as HTMLCollectionOf[HTMLElement], diff, onCrash, onAppleEat)).toThrow('Invalid direction');
    });
});

// Test the `move` method
describe('Snake move method', () => {
    it('should move the snake forward one cell', () => {
        // Given
        const snake: Snake = new Snake(Direction.Right, 3, [], Level.medium, () => {}, () => {});
        const expectedSnakeMap: number[][] = [[0, 0], [1, 0], [2, 0]]; // Expected snake position

        // When
        snake.move();

        // Then
        expect(snake.snakeMap).toEqual(expectedSnakeMap);
    });

    it('should handle turning left', () => {
        // Given
        const snake: Snake = new Snake(Direction.Right, 3, [], Level.medium, () => {}, () => {});
        snake.previousDirection = Direction.Right;

        // When
        snake.changeDirection(Direction.Left);
        snake.move();

        // Then
        expect(snake.direction).toBe(Direction.Left);
        expect(snake.snakeMap).toEqual([[1, 0], [0, 0], [-1, 0]]);
    });

    it('should handle turning right', () => {
        // Given
        const snake: Snake = new Snake = new Snake(Direction.Left, 3, [], Level.medium, () => {}, () => {});
        snake.previousDirection = Direction.Left;

        // When
        snake.changeDirection(Direction.Right);
        snake.move();

        // Then
        expect(snake.direction).toBe(Direction.Right);
        expect(snake.snakeMap).toEqual([[-1, 0], [0, 0], [1, 0]]);
    });

    it('should handle crashing into itself', () => {
        // Given
        const snake: Snake = new Snake(Direction.Right, 3, [], Level.medium, () => {}, () => {});
        snake.snakeMap.push([0, 0]); // Make snake collide with itself

        // When
        snake.move();

        // Then
        expect(snake.onCrash).toHaveBeenCalled();
    });
});