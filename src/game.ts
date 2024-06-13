import { BOARD_WIDTH, BOARD_HEIGHT, DOODLER_WIDTH, DOODLER_HEIGHT, PLATFORM_WIDTH, PLATFORM_HEIGHT, INITIAL_VELOCITY_Y } from './constants';
import { Doodler } from './doodler';
import { Platform } from './platform';
import { getHighScore, saveHighScore } from './storage';

class Game {
  board: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  doodler: Doodler;
  doodlerRightImg: HTMLImageElement;
  doodlerLeftImg: HTMLImageElement;
  platformImg: HTMLImageElement;
  platformArray: Platform[] = [];
  score: number = 0;
  maxScore: number = 0;
  highScore: number = 0;
  gameOver: boolean = false;

  constructor() {
    this.board = document.getElementById("board") as HTMLCanvasElement;
    this.board.height = BOARD_HEIGHT;
    this.board.width = BOARD_WIDTH;
    this.context = this.board.getContext("2d") as CanvasRenderingContext2D;

    this.doodlerRightImg = new Image();
    this.doodlerRightImg.src = "./right.png";
    this.doodlerLeftImg = new Image();
    this.doodlerLeftImg.src = "./left.png";

    this.platformImg = new Image();
    this.platformImg.src = "./platform.png";

    this.doodler = new Doodler(this.doodlerRightImg, BOARD_WIDTH / 2 - DOODLER_WIDTH / 2, (BOARD_HEIGHT * 7) / 8 - DOODLER_HEIGHT, DOODLER_WIDTH, DOODLER_HEIGHT);

    this.highScore = getHighScore();

    this.doodlerRightImg.onload = () => {
      this.context.drawImage(this.doodler.img!, this.doodler.x, this.doodler.y, this.doodler.width, this.doodler.height);
    };

    this.platformImg.onload = () => {
      this.showStartScreen();
    };

    document.getElementById("start-button")?.addEventListener("click", this.startGame.bind(this));
    document.addEventListener("keydown", this.moveDoodler.bind(this));
  }

  showStartScreen() {
    const startScreen = document.getElementById("start-screen");
    const board = document.getElementById("board");

    if (startScreen && board) {
      startScreen.style.display = "block";
      board.style.display = "none";
    }
  }

  startGame() {
    const startScreen = document.getElementById("start-screen");
    const board = document.getElementById("board");

    if (startScreen && board) {
      startScreen.style.display = "none";
      board.style.display = "block";
    }

    this.placePlatforms();
    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    requestAnimationFrame(this.update.bind(this));
    if (this.gameOver) {
      return;
    }

    this.context.clearRect(0, 0, this.board.width, this.board.height);

    this.doodler.move();
    if (this.doodler.y > this.board.height) {
      this.gameOver = true;
      saveHighScore(this.highScore);
    }

    this.context.drawImage(this.doodler.img!, this.doodler.x, this.doodler.y, this.doodler.width, this.doodler.height);

    this.platformArray.forEach((platform) => {
      if (this.doodler.velocityY < 0 && this.doodler.y < (BOARD_HEIGHT * 3) / 4) {
        platform.y -= INITIAL_VELOCITY_Y;
      }
      if (this.detectCollision(this.doodler, platform) && this.doodler.velocityY >= 0) {
        this.doodler.velocityY = INITIAL_VELOCITY_Y;
      }
      this.context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    });

    while (this.platformArray.length > 0 && this.platformArray[0].y >= BOARD_HEIGHT) {
      this.platformArray.shift();
      this.newPlatform();
    }

    this.updateScore();
    this.context.fillStyle = "black";
    this.context.font = "16px sans-serif";
    this.context.fillText("Score: " + this.score, 5, 20);
    this.context.fillText("High Score: " + this.highScore, 5, 40);

    if (this.gameOver) {
      this.context.fillText("Game Over: Press 'Space' to Restart", BOARD_WIDTH / 7, (BOARD_HEIGHT * 7) / 8);
    }
  }

  moveDoodler(e: KeyboardEvent) {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.doodler.velocityX = 4;
      this.doodler.img = this.doodlerRightImg;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.doodler.velocityX = -4;
      this.doodler.img = this.doodlerLeftImg;
    } else if (e.code === "Space" && this.gameOver) {
      this.resetGame();
    }
  }

  resetGame() {
    this.doodler.reset(this.doodlerRightImg, BOARD_WIDTH / 2 - DOODLER_WIDTH / 2, (BOARD_HEIGHT * 7) / 8 - DOODLER_HEIGHT);
    this.score = 0;
    this.maxScore = 0;
    this.gameOver = false;
    this.placePlatforms();
  }

  placePlatforms() {
    this.platformArray = [];

    let platform = new Platform(this.platformImg, BOARD_WIDTH / 2, BOARD_HEIGHT - 50, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    this.platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor((Math.random() * BOARD_WIDTH * 3) / 4);
      platform = new Platform(this.platformImg, randomX, BOARD_HEIGHT - 75 * i - 150, PLATFORM_WIDTH, PLATFORM_HEIGHT);
      this.platformArray.push(platform);
    }
  }

  newPlatform() {
    let randomX = Math.floor((Math.random() * BOARD_WIDTH * 3) / 4);
    let platform = new Platform(this.platformImg, randomX, -PLATFORM_HEIGHT, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    this.platformArray.push(platform);
  }

  detectCollision(doodler: Doodler, platform: Platform): boolean {
    return (
      doodler.x < platform.x + platform.width &&
      doodler.x + doodler.width > platform.x &&
      doodler.y < platform.y + platform.height &&
      doodler.y + doodler.height > platform.y
    );
  }

  updateScore() {
    let points = Math.floor(5 * Math.random());
    if (this.doodler.velocityY < 0) {
      this.maxScore += points;
      if (this.score < this.maxScore) {
        this.score = this.maxScore;
      }
    } else if (this.doodler.velocityY >= 0) {
      this.maxScore -= points;
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }
}

export { Game };
