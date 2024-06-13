export class Platform {
    img: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
  
    constructor(img: HTMLImageElement, x: number, y: number, width: number, height: number) {
      this.img = img;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }
  