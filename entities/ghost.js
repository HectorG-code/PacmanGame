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
		this.scared = false;
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
		let eyeOffset = { x: 0, y: 0 };
		switch (this.direction) {
			case PATH_UP:
				eyeOffset.y -= 1.5;
				break;
			case PATH_DOWN:
				eyeOffset.y += 1.5;
				break;
			case PATH_LEFT:
				eyeOffset.x -= 1.5;
				break;
			case PATH_RIGHT:
				eyeOffset.x += 1.5;
				break;
		}
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

	setScared = () => {
		this.scared = true;
		setTimeout(() => {
			this.scared = false;
		}, 3000);
	};
}
