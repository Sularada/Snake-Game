const restart = document
  .getElementById("restart")
  .addEventListener("click", restartFunction);
const pause = document.getElementById("pause");
pause.addEventListener("click", pauseFunction);
const popup = document.getElementById("popup");
const popup_score = document.getElementById("popup-score");
const popup_finish = document.getElementById("popup-finish");
const speed = document.getElementById("speed");
const cells = document.getElementById("cells");
cells.addEventListener("change", changeCellCount);
let screen = document.getElementById("screen");
let score = document.getElementById("score");
const snakeLength = document.getElementById("snake");
snakeLength.addEventListener("click", setSnakeLength);

let snake = {
  lenght: 3,
  location: [],
  last_move: 39,
};
let sleep_time;
let food_cell;

changeCellCount();

this.addEventListener("keydown", keybordAction);

let last_keybord_action;
let is_started = false;
let is_restarted = false;
let is_paused = false;
let is_game_over = false;

function setSnakeLength() {
  changeCellCount();
}

function keybordAction() {
  if (is_started == false) {
    is_started = true;
    console.log("a");
    startGame();
  } else {
    if (
      (this.event.keyCode == 40 && snake.last_move != 38) ||
      (this.event.keyCode == 39 && snake.last_move != 37) ||
      (this.event.keyCode == 38 && snake.last_move != 40) ||
      (this.event.keyCode == 37 && snake.last_move != 39)
    ) {
      last_keybord_action = this.event.keyCode;
      snake.last_move = this.event.keyCode;
    }
  }
}

function startGame() {
  speed.disabled = true;
  cells.disabled = true;
  snakeLength.disabled = true;
  snakeMove();
}

function changeCellCount() {
  screen.textContent = "";
  screen.style.width = `${parseInt(cells.value) * 17}px`;
  for (let i = 0; i < parseInt(cells.value) ** 2; i++) {
    let cell = document.createElement("span");
    cell.style.backgroundColor = "rgb(34, 60, 70)";
    cell.classList.add("cell");
    screen.appendChild(cell);
  }
  snakeStartLocation(parseInt(cells.value), parseInt(snakeLength.value));
}

function snakeStartLocation(cell, snake_lenght) {
  snake.location = [];
  all_cell = document.querySelectorAll(".cell");
  for (let i = 0; i < snake_lenght; i++) {
    if (cell % 2 == 0) {
      snake.location.push(parseInt(cell ** 2 / 2) - cell / 2 - i);
      all_cell[parseInt(cell ** 2 / 2) - cell / 2 - i].style.backgroundColor =
        "rgb(255, 255, 255)";
    } else {
      snake.location.push(parseInt(cell ** 2 / 2) - i);
      all_cell[parseInt(cell ** 2 / 2) - i].style.backgroundColor =
        "rgb(255, 255, 255)";
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function snakeMove() {
  generateRandomFood();
  last_keybord_action = 39;
  while (true) {
    await sleep(parseInt(1600 - speed.value));
    if (is_restarted == true || is_game_over == true) {
      is_restarted = false;
      is_game_over == false;
      break;
    } else if (is_paused == true) {
      continue;
    } else {
      if (last_keybord_action == 40) {
        moveToBottom();
      } else if (last_keybord_action == 39) {
        moveToRight();
      } else if (last_keybord_action == 38) {
        moveToTop();
      } else if (last_keybord_action == 37) {
        moveToLeft();
      } else {
        continue;
      }
    }
    if (gameFinished() == true) {
      break;
    }
  }
}
function moveToBottom() {
  for (let i = 0; i < snake.location.length; i++) {
    var trans_loc;
    if (i == snake.location.length - 1) {
      snakeLastPixel(i, trans_loc);
    } else if (i == 0) {
      trans_loc = snake.location[i];
      gameOver(
        snake.location[i] + parseInt(Math.pow(screen.childElementCount, 1 / 2))
      );
      snake.location[i] += parseInt(Math.pow(screen.childElementCount, 1 / 2));
      is_food_eated = eatFood(snake.location[i]);
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    } else {
      let temp = snake.location[i];
      snake.location[i] = trans_loc;
      trans_loc = temp;
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    }
  }
}
function moveToTop() {
  for (let i = 0; i < snake.location.length; i++) {
    var trans_loc;
    if (i == snake.location.length - 1) {
      snakeLastPixel(i, trans_loc);
    } else if (i == 0) {
      trans_loc = snake.location[i];
      gameOver(
        snake.location[i] - parseInt(Math.pow(screen.childElementCount, 1 / 2))
      );
      snake.location[i] -= parseInt(Math.pow(screen.childElementCount, 1 / 2));
      is_food_eated = eatFood(snake.location[i]);
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    } else {
      let temp = snake.location[i];
      snake.location[i] = trans_loc;
      trans_loc = temp;
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    }
  }
}
function snakeLastPixel(i, trans_loc) {
  if (is_food_eated == true) {
    is_food_eated = false;
    snake.location.push(snake.location[i]);
    generateRandomFood();
  } else {
    all_cell[snake.location[i]].style.backgroundColor = "rgb(34, 60, 70)";
    snake.location[i] = trans_loc;
  }
}
function moveToRight() {
  for (let i = 0; i < snake.location.length; i++) {
    var trans_loc;
    if (i == snake.location.length - 1) {
      snakeLastPixel(i, trans_loc);
    } else if (i == 0) {
      trans_loc = snake.location[i];
      gameOver(snake.location[i] + 1);
      snake.location[i] += 1;
      is_food_eated = eatFood(snake.location[i]);
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    } else {
      let temp = snake.location[i];
      snake.location[i] = trans_loc;
      trans_loc = temp;
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    }
  }
}

function moveToLeft() {
  for (let i = 0; i < snake.location.length; i++) {
    var trans_loc;
    if (i == snake.location.length - 1) {
      snakeLastPixel(i, trans_loc);
    } else if (i == 0) {
      trans_loc = snake.location[i];
      gameOver(snake.location[i] - 1);
      snake.location[i] -= 1;

      is_food_eated = eatFood(snake.location[i]);
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    } else {
      let temp = snake.location[i];
      snake.location[i] = trans_loc;
      trans_loc = temp;
      all_cell[snake.location[i]].style.backgroundColor = "rgb(255, 255, 255)";
    }
  }
}
function generateRandomFood() {
  let food = parseInt(all_cell.length * Math.random());
  if (all_cell[food].style.backgroundColor == "rgb(34, 60, 70)") {
    food_cell = all_cell[food];
    all_cell[food].style.backgroundColor = "rgb(0, 0, 255)";
  } else {
    generateRandomFood();
  }
}
function eatFood(index) {
  if (all_cell[index].style.backgroundColor == "rgb(0, 0, 255)") {
    score.textContent = parseInt(score.textContent) + 1;
    if (speed.value < 1500) {
      speed.value = parseInt(speed.value) + 50;
    }
    return true;
  } else {
    return false;
  }
}
function restartFunction() {
  speed.disabled = false;
  cells.disabled = false;
  snakeLength.disabled = false;
  speed.value = 800;
  score.textContent = 0;
  is_started = false;
  if (is_paused == true) {
    is_paused = false;
    pause.textContent = "PAUSE";
  }
  snake.location = [];
  changeCellCount();
  is_restarted = true;
}

function pauseFunction() {
  if (this.textContent == "PAUSE") {
    this.textContent = "RESUME";
    is_paused = true;
  } else {
    this.textContent = "PAUSE";
    is_paused = false;
  }
}

function gameOver(index) {
  if (
    index < 0 ||
    index > all_cell.length ||
    (snake.location[0] % parseInt(cells.value) == 0 &&
      index % parseInt(cells.value) == parseInt(cells.value) - 1) ||
    (snake.location[0] % parseInt(cells.value) == parseInt(cells.value) - 1 &&
      index % parseInt(cells.value) == 0)
  ) {
    is_game_over = true;
    popup.style.display = "flex";
    popup_score.textContent = score.textContent;
  } else {
    if (all_cell[index].style.backgroundColor == "rgb(255, 255, 255)") {
      is_game_over = true;
      popup.style.display = "flex";
      popup_score.textContent = score.textContent;
    }
  }
}

function gameFinished() {
  if (snake.location.length == all_cell.lenght) {
    popup_finish.style.display = "flex";
    return true;
  } else {
    return false;
  }
}
