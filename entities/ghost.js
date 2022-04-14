import {
	getNextPosition,
	isReverse,
	PATHS,
	PATH_DOWN,
	PATH_LEFT,
	PATH_RIGHT,
	PATH_UP,
} from '../directions.js';

export class Ghost {
	scared = false;
	constructor({ position, color, speed = 2 }) {
		this.position = position;
		this.direction = '';
		this.color = color;
		this.radius = 15;
		this.speed = speed;
		this.collisions = [];
		this.availablePaths = [];
	}

	draw = (c) => {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, Math.PI, 0);
		c.lineTo(this.position.x + this.radius, this.position.y + this.radius);
		c.lineTo(this.position.x - this.radius, this.position.y + this.radius);
		c.fillStyle = this.scared ? 'blue' : this.color;
		c.fill();
		c.closePath();
		c.beginPath();
		c.arc(
			this.position.x - this.radius / 2.5,
			this.position.y,
			this.radius / 3,
			0,
			Math.PI * 2
		);
		c.fillStyle = 'white';
		c.fill();
		c.closePath();
		c.beginPath();
		c.arc(
			this.position.x + this.radius / 2.5,
			this.position.y,
			this.radius / 3,
			0,
			Math.PI * 2
		);
		c.fillStyle = 'white';
		c.fill();
		c.closePath();
		let eyeOffset = getNextPosition({
			position: { x: 0, y: 0 },
			speed: 1.5,
			direction: this.direction,
		});
		if (!this.scared) {
			c.beginPath();
			c.arc(
				this.position.x - this.radius / 2.5 + eyeOffset.x,
				this.position.y + eyeOffset.y,
				this.radius / 5,
				0,
				Math.PI * 2
			);
			c.fillStyle = 'black';
			c.fill();
			c.closePath();
			c.beginPath();
			c.arc(
				this.position.x + this.radius / 2.5 + eyeOffset.x,
				this.position.y + eyeOffset.y,
				this.radius / 5,
				0,
				Math.PI * 2
			);
			c.fillStyle = 'black';
			c.fill();
			c.closePath();
		} else {
			c.beginPath();
			c.rect(
				this.position.x - this.radius / 2,
				this.position.y + this.radius / 2.5,
				this.radius,
				this.radius / 5
			);
			c.fillStyle = 'white';
			c.fill();
			c.closePath();
		}
	};

	update = (c) => {
		this.draw(c);
		this.position = getNextPosition({
			position: this.position,
			speed: this.speed,
			direction: this.direction,
		});
	};

	changeDirection = (destination) => {
		const possiblesPath = PATHS.filter(
			(path) =>
				!this.collisions.includes(path) &&
				!isReverse({ direction: this.direction, path: path })
		);
		if (
			this.availablePaths.sort().join(',') !== possiblesPath.sort().join(',')
		) {
			this.direction =
				possiblesPath[Math.floor(Math.random() * possiblesPath.length)];
			this.availablePaths = possiblesPath;
		}
	};

	setScared = () => {
		this.scared = true;
		setTimeout(() => {
			this.scared = false;
		}, 5000);
	};
}
