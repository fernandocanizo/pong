'use strict';

const PLAY_GROUND_COLOR = 'black';
const PLAYER_1_COLOR = 'red';
const PLAYER_2_COLOR = 'blue';

const PADDLE_SIZE_X = 10;
const PADDLE_SIZE_Y = 40;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

const BALL_SIZE_X = 50;
const BALL_SIZE_Y = 50;
const BALL_COLOR = 'white';
const BALL_DIMENSION = 6;
const BALL_VELOCITY_X = 4;
const BALL_VELOCITY_Y = 4;

const randSign = () => (Math.random() > 0.5) ? 1 : -1;

const reset = (canvas, game) => {
  // center the ball
  game.ball.x = canvas.width / 2;
  game.ball.y = canvas.height / 2;
  game.ball.velocity.x = -velocity.x;
  game.ball.velocity.y = 3;
};

const updateGame = (canvas, context, game) => {
  game.ball.x += BALL_VELOCITY_X;
  game.ball.y += BALL_VELOCITY_Y;

  // if ball goes above top and it was going upward
  if (game.ball.y < 0 && game.ball.velocity.y < 0) {
    game.ball.velocity.y = -game.ball.velocity.y;
  }
  // if ball goes below bottom and it was going down
  if (game.ball.y > canvas.height && game.ball.velocity.y > 0) {
    game.ball.velocity.y = -game.ball.velocity.y;
  }
  // if ball goes beyond left side
  if (game.ball.x < 0) {
    // if it's in paddle area, then bounce it
    if (game.ball.y > game.p1.y && game.ball.y < game.p1.y + PADDLE_HEIGHT) {
      game.ball.velocity.x = -game.ball.velocity.x;
      delta.y = game.ball.y - (game.p1.y + PADDLE_HEIGHT / 2);
      game.ball.velocity.y = delta.y * 0.3; // TODO make magic number a global constant
    } else {
      game.score.player1 += 1;
      reset(canvas, game);
    }
  }

  // if ball goes beyond right side
  if (game.ball.x > canvas.width) {
    // if it's in paddle area, then bounce it
    if (game.ball.y > game.p2.y && game.ball.y < game.p2.y + PADDLE_HEIGHT) {
      game.ball.velocity.x = -game.ball.velocity.x;
      delta.y = game.ball.y - (game.p2.y + PADDLE_HEIGHT / 2);
      game.ball.velocity.y = delta.y * 0.3; // TODO make magic number a global constant
    } else {
      game.score.player2 += 1;
      reset(canvas);
    }
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
  };

  const ball = {
    x: Math.floor(Math.random() * (playGround.width - BALL_DIMENSION)),
    y: Math.floor(Math.random() * (playGround.height - BALL_DIMENSION)),
    bd: BALL_DIMENSION,
    velocity: {
      x: 4 * randSign(),
      y: 4 * randSign(),
    },
  };
  console.log(ball);

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
