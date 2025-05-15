import Game from "./src/classes/Game.js";
/** Global Varible */
let game;
/** query selectors */
const startButton = document.getElementById("start-button");
const battlefield = document.getElementById("battlefield");
const scoreBoard = document.getElementById("score-board");

/** Event Listners */
startButton.addEventListener("click", () => {
  computerPlay();
});

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

    document.body.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        game.shooter.shoots();
        game.updatesPosition();
        game.movesBullet();
        updateDom();
      }
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
      if (game.gameOver) {
        clearInterval(timeInterval);
      }
    }, 10);
  }
}

/** DOM updates */
function createDom() {
  battlefield.innerHTML = "";

  /** create positions and place aliens */
  game.cells.map((cell) => {
    const el = document.createElement("div");
    el.id = `unit-${cell.id}`;
    el.classList.add("unit");

    battlefield.appendChild(el);
  });

  /** place shooter */
  const el = document.getElementById(`unit-${game.shooter.coordinates}`);
  el.textContent = "🛸";
}

function updateDom() {
  scoreBoard.textContent = `Score: ${game.scoreBoard}`;
  game.cells.forEach((cell) => {
    if (cell.id >= 0 && cell.id < 380) {
      const el = document.getElementById(`unit-${cell.id}`);

      if (cell.hasAlien || cell.hasBullet) {
        if (
          game.shooter.bullet &&
          cell.id === game.shooter.bullet.coordinates
        ) {
          el.textContent = "✦";
        } else {
          const findAlien = game.aliens.find(
            (alien) => alien.coordinates === cell.id
          );
          el.textContent = findAlien ? "👾" : "";
        }
      } else {
        el.textContent = "";
      }
    } else {
      /** Only makes DOM changes to shooter */
      const elPos = document.getElementById(`unit-${cell.id}`);
      elPos.textContent = game.shooter.coordinates === cell.id ? "🛸" : "";
    }
  });
}
