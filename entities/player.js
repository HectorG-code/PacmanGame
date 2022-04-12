import { PATH_UP, PATH_DOWN, PATH_LEFT, PATH_RIGHT } from '../global.js';

export class Player {
	constructor({ position, color = 'yellow', speed = 5 }) {
		this.position = position;
		this.direction = '';
		this.askedDirection = '';
		this.color = color;
		this.radius = 15;
		this.speed = speed;
		this.collision = false;
	}

	draw(c) {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}

	update(c) {
		this.draw(c);
		this.updatePosition();
	}

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
}
