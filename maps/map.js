import { DEFAULT_SIZE } from '../global.js';
import Entities from '../entities/common.js';

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

export const generateMap = (map) => {
	console.log(map);
	const player = new Entities.Player({
		position: { x: 0, y: 0 },
		velocity: { x: 0, y: 0 },
	});
	const boundaries = [];
	const pellets = [];
	const ghosts = [];

	map.forEach((row, i) => {
		row.forEach((elements, j) => {
			elements.split(',').forEach((el) => {
				if (tiles[el]) {
					const image = new Image();
					image.src = tiles[el];
					boundaries.push(
						new Entities.Boundary({
							position: { x: j * DEFAULT_SIZE, y: i * DEFAULT_SIZE },
							image: image,
							size: { width: DEFAULT_SIZE, height: DEFAULT_SIZE },
						})
					);
				} else if (el === '.')
					pellets.push(
						new Entities.Pellet({
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
						new Entities.Ghost({
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

	return { boundaries, pellets, player, ghosts };
};
