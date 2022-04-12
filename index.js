import { generateMap } from './maps/map.js';
import {
	canvas,
	c,
	scoreScr,
	PATH_UP,
	PATH_DOWN,
	PATH_LEFT,
	PATH_RIGHT,
	PATHS,
} from './global.js';
import { maps } from './maps/mapList.js';

const { boundaries, pellets, player, ghosts } = generateMap(maps[0]);

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

const achievedEndConditions = () => {
	let endCondition = false;

	ghosts.forEach((ghost) => {
		if (circleCollideWithCircle({ circle1: ghost, circle2: player }))
			endCondition = true;
	});

	if (pellets.length === 0) {
		endCondition = true;
	}

	return endCondition;
};

const animate = () => {
	if (!achievedEndConditions()) requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = pellets.length - 1; 0 <= i; i--) {
		const pellet = pellets[i];
		pellet.draw(c);
		if (circleCollideWithCircle({ circle1: pellet, circle2: player })) {
			pellets.splice(i, 1);
			setScore(10);
		}
	}

	player.collision = false;
	ghosts.forEach((ghost) => {
		ghost.collisions = [];
	});
	boundaries.forEach((boundary) => {
		boundary.draw(c);

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

		ghosts.forEach((ghost) => {
			if (
				circleCollideWithRectangle({
					circle: ghost,
					direction: ghost.direction,
					rectangle: boundary,
				})
			) {
				ghost.direction = '';
			}
			PATHS.forEach((path) => {
				if (
					!ghost.collisions.includes(path) &&
					circleCollideWithRectangle({
						circle: ghost,
						direction: path,
						rectangle: boundary,
					})
				) {
					ghost.collisions.push(path);
				}
			});
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
