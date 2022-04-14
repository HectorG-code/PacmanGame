import { PATH_UP, PATH_DOWN, PATH_LEFT, PATH_RIGHT } from '../global.js';

export class Player {
	angle = 0;
	angleIncrease = true;

	constructor({ position, color = 'yellow', speed = 5 }) {
		this.position = position;
		this.direction = '';
		this.askedDirection = '';
		this.orientation = 0;
		this.color = color;
		this.radius = 15;
		this.speed = speed;
		this.collision = false;
	}

	draw(c) {
		if (this.angle > 0.75) this.angleIncrease = false;
		else if (this.angle < 0) this.angleIncrease = true;
		this.angleIncrease ? (this.angle += 0.12) : (this.angle -= 0.12);
		c.save();
		c.translate(this.position.x, this.position.y);
		c.rotate(this.orientation);
		c.translate(-this.position.x, -this.position.y);
		c.beginPath();
		c.arc(
			this.position.x,
			this.position.y,
			this.radius,
			this.angle,
			Math.PI * 2 - this.angle
		);

		c.lineTo(this.position.x, this.position.y);

		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	update(c) {
		this.draw(c);
		this.updatePosition();
	}

	updatePosition = () => {
		switch (this.direction) {
			case PATH_UP:
				this.position.y -= this.speed;
				this.orientation = Math.PI * 1.5;
				break;
			case PATH_DOWN:
				this.position.y += this.speed;
				this.orientation = Math.PI / 2;
				break;
			case PATH_LEFT:
				this.position.x -= this.speed;
				this.orientation = Math.PI;
				break;
			case PATH_RIGHT:
				this.position.x += this.speed;
				this.orientation = 0;
				break;
		}
	};
}
