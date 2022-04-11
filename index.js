import { generateMap } from './maps/map.js';
import { canvas, c, scoreScr } from './global.js';
import { maps } from './maps/mapList.js';

const { boundaries, pellets, player, ghosts } = generateMap(maps[0]);

let score = 0;
function setScore(value) {
	score += value;
	scoreScr.textContent = score;
}

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
};

function circleCollideWithRectangle({ circle, rectangle }) {
	return (
		circle.position.y - circle.radius + circle.velocity.y <=
			rectangle.position.y + rectangle.height &&
		circle.position.x + circle.radius + circle.velocity.x >=
			rectangle.position.x &&
		circle.position.y + circle.radius + circle.velocity.y >=
			rectangle.position.y &&
		circle.position.x - circle.radius + circle.velocity.x <=
			rectangle.position.x + rectangle.width
	);
}

function circleCollideWithCircle({ circle1, circle2 }) {
	return (
		Math.hypot(
			circle2.position.x - circle1.position.x,
			circle2.position.y - circle1.position.y
		) <
		circle1.radius + circle2.radius
	);
}

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

	if (keys.w.pressed) {
		player.newVelocity = { x: 0, y: -5 };
	} else if (keys.a.pressed) {
		player.newVelocity = { x: -5, y: 0 };
	} else if (keys.s.pressed) {
		player.newVelocity = { x: 0, y: 5 };
	} else if (keys.d.pressed) {
		player.newVelocity = { x: 5, y: 0 };
	}
	player.collision = false;
	ghosts.forEach((ghost) => {
		ghost.collision = false;
		ghost.actual--;
		if (ghost.actual <= 0) {
			ghost.actual = ghost.refreshTime;
			ghost.getRandomVelocity();
		}
	});
	boundaries.forEach((boundary) => {
		boundary.draw(c);
		if (
			circleCollideWithRectangle({
				circle: player,
				rectangle: boundary,
			})
		) {
			player.velocity = { x: 0, y: 0 };
			player.collision = true;
		} else if (
			circleCollideWithRectangle({
				circle: { ...player, velocity: player.newVelocity },
				rectangle: boundary,
			})
		) {
			player.collision = true;
		}
		ghosts.forEach((ghost) => {
			if (
				circleCollideWithRectangle({
					circle: ghost,
					rectangle: boundary,
				})
			) {
				ghost.velocity = { x: 0, y: 0 };
				ghost.collision = true;
			} else if (
				circleCollideWithRectangle({
					circle: { ...ghost, velocity: ghost.newVelocity },
					rectangle: boundary,
				})
			)
				ghost.collision = true;
		});
	});
	if (!player.collision) player.velocity = player.newVelocity;
	player.update(c);

	ghosts.forEach((ghost) => {
		if (!ghost.collision) {
			ghost.velocity = ghost.newVelocity;
		}
		ghost.update(c);
	});
};

animate();

addEventListener('keydown', ({ key }) => {
	if (keys[key]) {
		Object.entries(keys).forEach((i) => {
			keys[i[0]].pressed = i[0] === key;
		});
	}
});
