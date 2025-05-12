/** Global Varible */
let game;

/** query selectors */
const startButton = document.getElementById("start-button");

/** Event Listners */
startButton.addEventListener("click", (e) => {
  computerPlay();
});

/** Class components */
class Game {
  constructor() {
    this.positions = [];
    this.aliens = [];
    this.counter = 0;
    this.direction = "right";
    this.gameOver = false;
    this.shooter = new Shooter();
  }

  createBoard() {
    this.aliens = new Aliens();
    this.aliens.createAliens();

    for (let x = 0; x < 400; x++) {
      let position = new Position(x);
      this.positions.push(position);
    }

    this.aliens.aliens.forEach((alien) => {
      this.positions[alien.coordinates].alien = alien;
    });
  }

  moveAliens() {
    const GRID_WIDTH = 20;
    const alienPositions = this.aliens.aliens.map((alien) => alien.coordinates);
    const leftMost = Math.min(...alienPositions);
    const rightMost = Math.max(...alienPositions);

    this.aliens.aliens.forEach((alien) => {
      /** move right */
      if (this.direction === "right") {
        alien.coordinates++;
        if (alien.id === 0 || alien.id === 11 || alien.id === 22) {
          this.positions[alien.coordinates - 1].alien = false;
        }
      }
      /** move down */
      if (this.direction === "down") {
        let oldPos = alien.coordinates;
        alien.coordinates = alien.coordinates + 20;
        if (alien.id < 11) {
          this.positions[oldPos].alien = false;
        }
      }
      /** move left */
      if (this.direction === "left") {
        alien.coordinates--;

        if (alien.id === 10 || alien.id === 21 || alien.id === 32) {
          this.positions[alien.coordinates + 1].alien = false;
        }
      }
      if (alien.coordinates >= 0 && alien.coordinates < this.positions.length) {
        this.positions[alien.coordinates].alien = true;
      }
    });

    if (this.direction === "right" && (rightMost + 1) % GRID_WIDTH === 19) {
      this.direction = "down";
      this.nextDirection = "left";
    } else if (this.direction === "left" && (leftMost + 1) % GRID_WIDTH === 2) {
      this.direction = "down";
      this.nextDirection = "right";
    } else if (this.direction === "down" && this.nextDirection) {
      this.direction = this.nextDirection;
      this.nextDirection = null;
    }

    this.counter++;

    if (this.counter === 169) {
      this.gameOver = true;
      return;
    }
  }
}

class Position {
  constructor(id) {
    this.id = id;
    this.alien = false;
    this.shooter = false;
  }
}

class Aliens {
  constructor() {
    this.aliens = [];
  }

  createAliens() {
    for (let a = 0; a < 33; a++) {
      for (let x = 0; x < 11; x++) {
        let alien = new Alien(a, x);
        this.aliens.push(alien);
      }
      for (let x = 20; x < 31; x++) {
        let alien = new Alien(a, x);
        this.aliens.push(alien);
      }

      for (let x = 40; x < 51; x++) {
        let alien = new Alien(a, x);
        this.aliens.push(alien);
      }
    }
  }
}

class Alien {
  constructor(id, coordinates) {
    this.id = id;
    this.coordinates = coordinates;
    this.isAlive = true;
  }
}

class Shooter {
  constructor() {
    this.position = 388;
  }

  moveShooter(direction) {
    if (direction === "ArrowRight" && this.position < 399) {
      this.position++;
    } else if (direction === "ArrowLeft" && this.position > 380) {
      this.position--;
    }
  }
}

/** Functions */
function initiateGame() {
  game = new Game();
  game.createBoard();
  if (game) {
    document.body.addEventListener("keydown", (e) => {
      const key = e.key;
      game.shooter.moveShooter(key);
      updateDom();
    });
  }
  createDom();
}

function computerPlay() {
  if (!game) {
    initiateGame();
    let counter = 0;
    const timeInterval = setInterval(() => {
      game.moveAliens();
      updateDom();
      counter++;
      if (game.gameOver === true) {
        clearInterval(timeInterval);
      }
    }, 100);
  }
}

/** DOM updates */
function createDom() {
  /** create positions and place aliens */
  game.positions.map((position) => {
    const el = document.createElement("div");
    el.id = `unit-${position.id}`;
    el.classList.add("unit");
    el.textContent = position.alien ? "👾" : "";
    battlefield.appendChild(el);
  });

  /** place shooter */
  const el = document.getElementById(`unit-${game.shooter.position}`);
  el.textContent = "🛸";
}

function updateDom() {
  game.positions.forEach((position) => {
    /** only makes DOM changes to the battlefield */
    if (position.id >= 0 && position.id < 380) {
      const el = document.getElementById(`unit-${position.id}`);
      el.textContent = position.alien ? "👾" : "";
    } else {
      /** Only makes DOM changes to shooter */
      const el = document.getElementById(`unit-${game.shooter.position}`);
      const elPos = document.getElementById(`unit-${position.id}`);
      elPos.textContent = game.shooter.position === position.id ? "🛸" : "";
    }
  });
}
