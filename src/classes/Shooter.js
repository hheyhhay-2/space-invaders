import Bullet from "./Bullet.js";

export default class Shooter {
  constructor() {
    this.coordinates = 388;
    this.bullet = undefined;
  }

  moveShooter(direction) {
    if (direction === "ArrowRight" && this.coordinates < 399) {
      this.coordinates++;
    } else if (direction === "ArrowLeft" && this.coordinates > 380) {
      this.coordinates--;
    }
  }
  shoots() {
    this.bullet = new Bullet(this.coordinates);
  }
}
