import { BOARD_WIDTH, INITIAL_VELOCITY_Y, GRAVITY } from './constants';

export class Doodler {
  img: HTMLImageElement | null = null;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number = 0;
  velocityY: number = INITIAL_VELOCITY_Y;

  constructor(img: HTMLImageElement, x: number, y: number, width: number, height: number) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  move() {
    this.x += this.velocityX;
    if (this.x > BOARD_WIDTH) {
      this.x = 0;
    } else if (this.x + this.width < 0) {
      this.x = BOARD_WIDTH;
    }

    this.velocityY += GRAVITY;
    this.y += this.velocityY;
  }

  reset(img: HTMLImageElement, x: number, y: number) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = INITIAL_VELOCITY_Y;
  }
}
