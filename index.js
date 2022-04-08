const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
	static width = 40;
	static height = 40;

	constructor({ position, image }) {
		this.position = position;
		this.width = Boundary.width;
		this.height = Boundary.height;
		this.image = image;
	}

	draw() {
		c.drawImage(this.image, this.position.x, this.position.y);
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
	}

	draw() {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = 'yellow';
		c.fill();
		c.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
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

const boundaries = [];
const player = new Player({
	position: { x: Boundary.width * 1.5, y: Boundary.height * 1.5 },
	velocity: { x: 0, y: 0 },
});

const map = [
	['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
	['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
	['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
];

const tiles = {
	b: './assets/block.png',
	1: './assets/pipeCorner1.png',
	2: './assets/pipeCorner2.png',
	3: './assets/pipeCorner3.png',
	4: './assets/pipeCorner4.png',
	5: './assets/pipeConnectorTop.png',
	6: './assets/pipeConnectorLeft.png',
	7: './assets/pipeConnectorBottom.png',
	8: './assets/pipeConnectorRight.png',
	'-': './assets/pipeHorizontal.png',
	'|': './assets/pipeVertical.png',
	'[': './assets/capLeft.png',
	']': './assets/capRight.png',
	'^': './assets/capTop.png',
	_: './assets/capBottom.png',
	'+': './assets/pipeCross.png',
};

map.forEach((row, i) => {
	row.forEach((tile, j) => {
		if (tiles[tile]) {
			const image = new Image();
			image.src = tiles[tile];
			boundaries.push(
				new Boundary({
					position: { x: j * Boundary.width, y: i * Boundary.height },
					image: image,
				})
			);
		}
	});
});

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

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	player.update();
	const newVelocity = { x: 0, y: 0 };
	if (keys.w.pressed) {
		newVelocity.y = -5;
	} else if (keys.a.pressed) {
		newVelocity.x = -5;
	} else if (keys.s.pressed) {
		newVelocity.y = 5;
	} else if (keys.d.pressed) {
		newVelocity.x = 5;
	}
	let collision = false;
	boundaries.forEach((boundary) => {
		boundary.draw();
		if (
			circleCollideWithRectangle({
				circle: player,
				rectangle: boundary,
			})
		) {
			player.velocity = { x: 0, y: 0 };
			collision = true;
		}
		if (
			!collision &&
			circleCollideWithRectangle({
				circle: { ...player, velocity: newVelocity },
				rectangle: boundary,
			})
		) {
			collision = true;
		}
	});
	if (!collision) player.velocity = newVelocity;
}

animate();

addEventListener('keydown', ({ key }) => {
	if (keys[key]) {
		Object.entries(keys).forEach((i) => {
			keys[i[0]].pressed = i[0] === key;
		});
	}
});

// addEventListener('keyup', ({ key }) => {
// 	if (keys[key]) {
// 		keys[key].pressed = false;
// 	}
// });
