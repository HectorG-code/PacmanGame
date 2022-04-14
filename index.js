import { generateMap } from './maps/map.js';
import { canvas, c, scoreScr, DEFAULT_SIZE } from './global.js';
import {
	PATH_UP,
	PATH_DOWN,
	PATH_LEFT,
	PATH_RIGHT,
	PATHS,
} from './directions.js';
import { PowerUp } from './entities/pellet.js';
import { original } from './maps/maplist.js';

const { boundaries, pellets, player, ghosts } = generateMap(original);

let score = 0;
const setScore = (value) => {
	score += value;
	scoreScr.textContent = score;
};

const circleCollideWithRectangle = ({ circle, direction, rectangle }) => {
	const padding = rectangle.width / 2 - circle.radius - 1;

	let x = 0;
	let y = 0;

	switch (direction) {
		case PATH_UP:
			y = -circle.speed;
			break;
		case PATH_DOWN:
			y = circle.speed;
			break;
		case PATH_LEFT:
			x = -circle.speed;
			break;
		case PATH_RIGHT:
			x = circle.speed;
			break;
	}

	return (
		circle.position.y - circle.radius + y <=
			rectangle.position.y + rectangle.height + padding &&
		circle.position.x + circle.radius + x >= rectangle.position.x - padding &&
		circle.position.y + circle.radius + y >= rectangle.position.y - padding &&
		circle.position.x - circle.radius + x <=
			rectangle.position.x + rectangle.width + padding
	);
};

const circleCollideWithCircle = ({ circle1, circle2 }) => {
	return (
		Math.hypot(
			circle2.position.x - circle1.position.x,
			circle2.position.y - circle1.position.y
		) <
		circle1.radius + circle2.radius
	);
};

const animate = () => {
	const animationId = requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	let poweredUp = false;

	for (let i = pellets.length - 1; 0 <= i; i--) {
		const pellet = pellets[i];
		pellet.draw(c);
		if (circleCollideWithCircle({ circle1: pellet, circle2: player })) {
			pellets.splice(i, 1);
			if (pellet instanceof PowerUp) {
				poweredUp = true;
			}
			setScore(pellet.points);
		}
	}

	if (pellets.length === 0) {
		cancelAnimationFrame(animationId);
	}

	player.collision = false;
	ghosts.forEach((ghost, i) => {
		if (poweredUp) {
			ghost.setScared();
		}
		if (circleCollideWithCircle({ circle1: ghost, circle2: player })) {
			if (ghost.isAlive()) {
				cancelAnimationFrame(animationId);
			} else {
				ghost.setDead();
			}
		}
		ghost.resetCollisions();
	});
	boundaries.forEach((boundary) => {
		boundary.draw(c);
		if (
			boundary.position.x > player.position.x - DEFAULT_SIZE * 2 &&
			boundary.position.x < player.position.x + DEFAULT_SIZE * 2 &&
			boundary.position.y > player.position.y - DEFAULT_SIZE * 2 &&
			boundary.position.y < player.position.y + DEFAULT_SIZE * 2
		) {
			if (
				circleCollideWithRectangle({
					circle: player,
					direction: player.direction,
					rectangle: boundary,
				})
			) {
				player.direction = '';
				player.collision = true;
			} else if (
				circleCollideWithRectangle({
					circle: player,
					direction: player.wantedDirection,
					rectangle: boundary,
				})
			) {
				player.collision = true;
			}
		}

		ghosts.forEach((ghost) => {
			if (
				boundary.position.x > ghost.position.x - DEFAULT_SIZE * 2 &&
				boundary.position.x < ghost.position.x + DEFAULT_SIZE * 2 &&
				boundary.position.y > ghost.position.y - DEFAULT_SIZE * 2 &&
				boundary.position.y < ghost.position.y + DEFAULT_SIZE * 2
			) {
				PATHS.forEach((path) => {
					if (
						!ghost.collisions.includes(path) &&
						circleCollideWithRectangle({
							circle: ghost,
							direction: path,
							rectangle: boundary,
						})
					) {
						ghost.addCollision(path);
					}
				});
			}
		});
	});
	if (!player.collision) player.direction = player.wantedDirection;
	player.update(c);
	ghosts.forEach((ghost) => {
		ghost.changeDirection(player.position);
		ghost.update(c);
	});
};

animate();

addEventListener('keydown', ({ key }) => {
	if (key === 'w') {
		player.wantedDirection = PATH_UP;
	} else if (key === 'a') {
		player.wantedDirection = PATH_LEFT;
	} else if (key === 's') {
		player.wantedDirection = PATH_DOWN;
	} else if (key === 'd') {
		player.wantedDirection = PATH_RIGHT;
	}
});

addEventListener('keyup', ({ key }) => {
	if (key === 'w' && player.wantedDirection === PATH_UP) {
		player.wantedDirection = '';
	} else if (key === 'a' && player.wantedDirection === PATH_LEFT) {
		player.wantedDirection = '';
	} else if (key === 's' && player.wantedDirection === PATH_DOWN) {
		player.wantedDirection = '';
	} else if (key === 'd' && player.wantedDirection === PATH_RIGHT) {
		player.wantedDirection = '';
	}
});
