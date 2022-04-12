import { PATH_UP, PATH_DOWN, PATH_LEFT, PATH_RIGHT } from '../global.js';

export class Ghost {
	constructor({ position, color, speed = 2 }) {
		this.position = position;
		this.direction = '';
		this.color = color;
		this.radius = 15;
		this.speed = speed;
		this.collisions = [];
		this.prevCollisions = [];
	}

	draw = (c) => {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	};

	update = (c) => {
		this.newPath();
		this.draw(c);
		this.updatePosition();
	};

	updatePosition = () => {
		switch (this.direction) {
			case PATH_UP:
				this.position.y -= this.speed;
				break;
			case PATH_DOWN:
				this.position.y += this.speed;
				break;
			case PATH_LEFT:
				this.position.x -= this.speed;
				break;
			case PATH_RIGHT:
				this.position.x += this.speed;
				break;
		}
	};

	newPath = () => {
		if (this.collisions.length > this.prevCollisions.length) {
			this.prevCollisions = [...this.collisions];
		}
		if (!this.direction) {
			this.prevCollisions = [PATH_UP, PATH_DOWN, PATH_LEFT, PATH_RIGHT];
		} else this.prevCollisions.push(this.direction);
		const pathWays = this.prevCollisions.filter(
			(collision) => !this.collisions.includes(collision)
		);
		this.direction = pathWays[Math.floor(Math.random() * pathWays.length)];

		this.prevCollisions = [...this.collisions];
	};
}
