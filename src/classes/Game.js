import Shooter from "./Shooter.js";
import Alien from "./Alien.js";
import Cell from "./Cell.js";

export default class Game {
  constructor() {
    this.cells = [];
    this.aliens = [];
    this.counter = 0;
    this.direction = "right";
    this.gameOver = false;
    this.shooter;
    this.scoreBoard = 0;
  }

  createBoard() {
    this.shooter = new Shooter();
    for (let x = 0; x < 400; x++) {
      let cell = new Cell(x);
      this.cells.push(cell);
    }
    this.createAliens();
  }

  createAliens() {
    const rows = [0, 20, 40];
    for (let a = 0; a < 33; a++) {
      rows.forEach((row) => {
        for (let x = row; x < row + 10; x++) {
          let alien = new Alien(a, x);
          this.aliens.push(alien);
          this.cells[x].hasAlien = true;
        }
      });
    }
  }

  moveAliens() {
    const GRID_WIDTH = 20;
    this.aliens.forEach((alien) => {
      if (alien.coordinates >= 0 && alien.coordinates < this.cells.length) {
        this.cells[alien.coordinates].hasAlien = false;
      }
    });
    const alienPositions = this.aliens.map((alien) => alien.coordinates);
    const leftMost = Math.min(...alienPositions);
    const rightMost = Math.max(...alienPositions);

    this.aliens.forEach((alien) => {
      if (this.direction === "right") {
        alien.coordinates++;
      } else if (this.direction === "left") {
        alien.coordinates--;
      } else if (this.direction === "down") {
        alien.coordinates += GRID_WIDTH;
      }
    });

    this.aliens.forEach((alien) => {
      if (alien.coordinates >= 0 && alien.coordinates < this.cells.length) {
        this.cells[alien.coordinates].hasAlien = true;
      }
    });

    if (this.direction === "right" && (rightMost + 2) % GRID_WIDTH === 0) {
      this.direction = "down";
      this.nextDirection = "left";
    } else if (this.direction === "left" && (leftMost - 1) % GRID_WIDTH === 0) {
      this.direction = "down";
      this.nextDirection = "right";
    } else if (this.direction === "down" && this.nextDirection) {
      this.direction = this.nextDirection;
      this.nextDirection = null;
    }

    this.counter++;

    if (this.counter === 186) {
      this.gameOver = true;
    }
  }

  movesBullet() {
    if (!this.shooter.bullet || !this.shooter.bullet.coordinates) return;
    this.cells[this.shooter.bullet.coordinates].hasBullet = false;

    this.shooter.bullet.coordinates -= 20;

    if (this.shooter.bullet.coordinates < 0) {
      this.shooter.bullet = null;
    }

    const cell = this.shooter.bullet
      ? this.cells[this.shooter.bullet.coordinates]
      : null;

    if (this.shooter.bullet && cell.hasAlien) {
      this.scoreBoard++;
      cell.hasAlien = false;
      this.aliens = this.aliens.filter(
        (alien) => alien.coordinates !== this.shooter.bullet.coordinates
      );
    } else {
      this.shooter.bullet
        ? (this.cells[this.shooter.bullet.coordinates].hasBullet = true)
        : null;
    }

    if (this.shooter.bullet && this.shooter.bullet.coordinates < 0) {
      this.shooter.bullet = null;
      return;
    }
  }

  updatesPosition() {
    const timeInterval = setInterval(() => {
      this.movesBullet();
      if (!this.shooter.bullet || this.shooter.bullet.coordinates <= 0) {
        clearInterval(timeInterval);
      }
    }, 100);

    if (this.shooter.bullet.coordinates) {
      this.cells[this.shooter.bullet.coordinates].hasBullet = true;
    }
  }
}
