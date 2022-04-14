import { getNextPosition, isReverse, PATHS } from '../directions.js';

const STATE_SCARED = 'scared';
const STATE_ALIVE = 'alive';
const STATE_DEAD = 'dead';

export class Ghost {
	state = STATE_ALIVE;
	state_timer = null;
	direction = '';
	collisions = [];
	availablePaths = [];

	constructor({ position, color, speed = 2 }) {
		this.position = position;
		this.color = color;
		this.radius = 15;
		this.speed = speed;
	}

	addCollision = (collision) => {
		this.collisions.push(collision);
	};

	resetCollisions = () => {
		this.collisions = [];
	};

	drawBody = (c) => {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, Math.PI, 0);
		c.lineTo(this.position.x + this.radius, this.position.y + this.radius);
		c.lineTo(this.position.x - this.radius, this.position.y + this.radius);
		c.fillStyle = this.state === STATE_SCARED ? 'blue' : this.color;
		c.fill();
		c.closePath();
	};

	drawEyes = (c) => {
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
	};

	drawEyeballs = (c) => {
		let eyeOffset = getNextPosition({
			position: { x: 0, y: 0 },
			speed: 1.5,
			direction: this.direction,
		});
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

	drawMouth = (c) => {
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
	};

	draw = (c) => {
		switch (this.state) {
			case STATE_ALIVE:
				this.drawBody(c);
				this.drawEyes(c);
				this.drawEyeballs(c);
				break;
			case STATE_SCARED:
				this.drawBody(c);
				this.drawEyes(c);
				this.drawMouth(c);
				break;
			case STATE_DEAD:
				this.drawEyes(c);
				this.drawEyeballs(c);
				break;
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
		if (this.state === STATE_DEAD) return;
		clearTimeout(this.state_timer);
		this.state = STATE_SCARED;
		this.state_timer = setTimeout(() => {
			this.state = STATE_ALIVE;
		}, 5000);
	};

	setDead = () => {
		clearTimeout(this.state_timer);
		this.state = STATE_DEAD;
		this.state_timer = setTimeout(() => {
			this.state = STATE_ALIVE;
		}, 5000);
	};

	isAlive = () => {
		if (this.state === STATE_ALIVE) return true;
		return false;
	};

	collisionPlayer = () => {
		if (this.state === STATE_SCARED) this.setDead();
		return;
	};
}
