import { c, DEFAULT_SIZE } from './global.js';
import { Entity, Ghost, player, ghosts } from './entities.js';

export class Boundary {
	constructor({ position, image }) {
		this.position = position;
		this.width = DEFAULT_SIZE;
		this.height = DEFAULT_SIZE;
		this.image = image;
	}

	draw() {
		c.drawImage(this.image, this.position.x, this.position.y);
	}
}

export class Pellet {
	constructor({ position }) {
		this.position = position;
		this.radius = 3;
	}

	draw() {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = 'white';
		c.fill();
		c.closePath();
	}
}

const map = [
	['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
	['|', '.,gred', '.', '.', '.', '.', '.', '.', '.', '.,ggreen', '|'],
	['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
	['|', '.,gviolet', '.', '.', '.', '.', '.', '.', '.', '.,gpink', '|'],
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

export const boundaries = [];
export const pellets = [];

map.forEach((row, i) => {
	row.forEach((elements, j) => {
		elements.split(',').forEach((el) => {
			if (tiles[el]) {
				const image = new Image();
				image.src = tiles[el];
				boundaries.push(
					new Boundary({
						position: { x: j * DEFAULT_SIZE, y: i * DEFAULT_SIZE },
						image: image,
						context: c,
					})
				);
			} else if (el === '.')
				pellets.push(
					new Pellet({
						position: {
							x: DEFAULT_SIZE * (j + 0.5),
							y: DEFAULT_SIZE * (i + 0.5),
						},
					})
				);
			else if (el === 'p') {
				player.position = {
					x: DEFAULT_SIZE * (j + 0.5),
					y: DEFAULT_SIZE * (i + 0.5),
				};
				player.velocity = { x: 0, y: 0 };
			} else if (el.charAt(0) === 'g')
				ghosts.push(
					new Ghost({
						position: {
							x: DEFAULT_SIZE * (j + 0.5),
							y: DEFAULT_SIZE * (i + 0.5),
						},
						velocity: { x: 0, y: 0 },
						color: el.slice(1, el.length),
						refresh: 15,
					})
				);
		});
	});
});
