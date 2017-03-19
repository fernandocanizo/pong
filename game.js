'use strict';

const PLAY_GROUND_COLOR = 'black';
const PLAYER_1_COLOR = 'red';
const PLAYER_2_COLOR = 'blue';

const PADDLE_SIZE_X = 10;
const PADDLE_SIZE_Y = 40;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

const BALL_COLOR = 'white';
const BALL_SIZE = 6;
const BALL_VELOCITY_X = 5;
const BALL_VELOCITY_Y = 5;

const randSign = () => (Math.random() > 0.5) ? 1 : -1;
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const reset = (canvas, game) => {
  // center the ball
  game.ball.x = canvas.width / 2 + Math.floor(Math.random() * 5);
  game.ball.y = canvas.height / 2 + Math.floor(Math.random() * 5);
  game.ball.velocity.x = randRange(BALL_VELOCITY_X, BALL_VELOCITY_X + 3) * randSign();
  game.ball.velocity.y = randRange(BALL_VELOCITY_X, BALL_VELOCITY_X + 3) * randSign();

  // center player 2 and reset its velocity
  game.p2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
  game.p2.velocity.y = 0;
};

const updateGame = (canvas, context, game) => {
  game.ball.x += game.ball.velocity.x;
  game.ball.y += game.ball.velocity.y;

  if (game.ball.y <= 0) {
    // if ball goes above top
    game.ball.velocity.y = -game.ball.velocity.y;
  } else if (game.ball.y >= canvas.height) {
    // if ball goes below bottom
    game.ball.velocity.y = -game.ball.velocity.y;
  }

  // if ball goes beyond left side
  if (game.ball.x <= 0 + BALL_SIZE / 2 + PADDLE_THICKNESS) {
    // if it's in paddle area, then bounce it
    if (game.ball.y >= (game.p1.y - PADDLE_HEIGHT / 2) && game.ball.y <= (game.p1.y + PADDLE_HEIGHT / 2)) {
      game.ball.velocity.x = -game.ball.velocity.x;
    } else {
      game.score.player2 += 1;
      reset(canvas, game);
    }

  // if ball goes beyond right side
  } else if (game.ball.x >= canvas.width - BALL_SIZE / 2 - PADDLE_THICKNESS) {
    // if it's in paddle area, then bounce it
    if (game.ball.y >= (game.p2.y - PADDLE_HEIGHT / 2) && game.ball.y <= (game.p2.y + PADDLE_HEIGHT / 2)) {
      game.ball.velocity.x = -game.ball.velocity.x;
    } else {
      game.score.player1 += 1;
      reset(canvas, game);
    }
  }

  // "A.I." :P, for player 2
  game.p2.velocity.y = game.ball.velocity.y;
  game.p2.y += game.p2.velocity.y;

  // ensure player 2 doesn't go off screen
  if ((game.p2.y + PADDLE_HEIGHT) > canvas.height) {
    game.p2.y = canvas.height - PADDLE_HEIGHT;
  }
  if (game.p2.y < 0) {
    game.p2.y = 0;
  }

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = game.p1.color;
  context.fillRect(game.p1.x, game.p1.y, PADDLE_THICKNESS, PADDLE_HEIGHT);

  context.fillStyle = game.p2.color;
  context.fillRect(game.p2.x, game.p2.y, PADDLE_THICKNESS, PADDLE_HEIGHT);

  context.fillStyle = BALL_COLOR;
  context.fillRect(game.ball.x - game.ball.bd / 2, game.ball.y - game.ball.bd, game.ball.bd, game.ball.bd);

  context.fillText(game.score.player1, 100, 15);
  context.fillText(game.score.player2, canvas.width - 100, 15);
};

window.onload = () => {
  const playGround = document.getElementById('playGround');
  const context = playGround.getContext('2d');

  const player1 = {
    x: 0,
    y: playGround.height / 2 - PADDLE_HEIGHT / 2,
    color: PLAYER_1_COLOR,
  };

  const player2 = {
    x: playGround.width - PADDLE_THICKNESS,
    y: playGround.height / 2 - PADDLE_HEIGHT / 2,
    color: PLAYER_2_COLOR,
    velocity: {
      x: 0,
      y: 0,
    },
  };

  const ball = {
    x: Math.floor(Math.random() * (playGround.width - BALL_SIZE)),
    y: Math.floor(Math.random() * (playGround.height - BALL_SIZE)),
    bd: BALL_SIZE,
    velocity: {
      x: 4 * randSign(),
      y: 4 * randSign(),
    },
  };

  const score = {
    player1: 0,
    player2: 0,
  };

  const game = {
    p1: player1,
    p2: player2,
    ball: ball,
    score: score,
  };

  const intervalId = setInterval(() => {
    updateGame(playGround, context, game);
  }, 1000 / 30);
};
