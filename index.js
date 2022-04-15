import { generateMap } from './maps/map.js';
import {
	canvas,
	c,
	scoreScr,
	DEFAULT_SIZE,
	circleCollideWithRectangle,
	circleCollideWithCircle,
} from './global.js';
import {
	PATH_UP,
	PATH_DOWN,
	PATH_LEFT,
	PATH_RIGHT,
	PATHS,
	getNextPosition,
} from './directions.js';
import { PowerUp } from './entities/pellet.js';
import { original } from './maps/maplist.js';

const { boundaries, pellets, player, ghosts } = generateMap(original);

let score = 0;
const setScore = (value) => {
	score += value;
	scoreScr.textContent = score;
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
				ghost.collisionPlayer();
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
					position: getNextPosition({
						position: player.position,
						speed: player.speed,
						direction: player.direction,
					}),
					radius: player.radius,
					rectangle: boundary,
				})
			) {
				player.direction = '';
				player.collision = true;
			} else if (
				circleCollideWithRectangle({
					position: getNextPosition({
						position: player.position,
						speed: player.speed,
						direction: player.wantedDirection,
					}),
					radius: player.radius,
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
					if (!ghost.collisions.includes(path)) {
						const position = getNextPosition({
							position: ghost.position,
							speed: ghost.speed,
							direction: path,
						});

						if (
							circleCollideWithRectangle({
								position: position,
								radius: ghost.radius,
								rectangle: boundary,
							})
						) {
							ghost.addCollision(path);
						}
					}
				});
			}
		});
	});
	if (!player.collision) player.direction = player.wantedDirection;
	player.update(c);
	ghosts.forEach((ghost) => {
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
