import { getNextPosition, isReverse, PATHS } from '../directions.js';

const STATE_STARTED = 'started';
const STATE_SCARED = 'scared';
const MODE_SCATTER = 'scatter';
const MODE_CHASE = 'chase';
const STATE_ALIVE = 'alive';
const STATE_DEAD = 'dead';

export class Ghost {
	state = STATE_STARTED;
	state_timer = null;
	direction = '';
	collisions = [];
	availablePaths = [];
	destination = null;

	constructor({
		position,
		color,
		speed = 2,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		this.position = position;
		this.color = color;
		this.radius = 15;
		this.speed = speed;
		this.destination = { ...exitPosition };
		this.exitPosition = { ...exitPosition };
		this.scatterPosition = { ...scatterPosition };
		this.respawnPosition = { ...respawnPosition };
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
			case STATE_STARTED:
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
		if (this.isDestinationReached()) {
			this.reachDestination();
		}
		this.changeDirection();
		this.position = getNextPosition({
			position: this.position,
			speed: this.speed,
			direction: this.direction,
		});
	};

	setDestination = (destination) => {
		this.destination = { ...destination };
	};

	isDestinationReached = () => {
		return (
			this.position.x === this.destination.x &&
			this.position.y === this.destination.y
		);
	};

	reachDestination = () => {
		if (this.state === STATE_DEAD) {
			this.state = STATE_STARTED;
			this.destination = { ...this.exitPosition };
		} else if (this.state === STATE_STARTED) {
			this.state = STATE_ALIVE;
			this.destination = { ...this.scatterPosition };
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
		this.setDestination(this.respawnPosition);
	};

	changeDirection = () => {
		const possiblesPath = PATHS.filter(
			(path) =>
				!this.collisions.includes(path) &&
				!isReverse({ direction: this.direction, path: path })
		);
		if (
			this.availablePaths.sort().join(',') !== possiblesPath.sort().join(',')
		) {
			let newPath = null;
			possiblesPath.forEach((path) => {
				const nextPosition = getNextPosition({
					position: this.position,
					speed: this.speed,
					direction: path,
				});
				const distance = Math.sqrt(
					Math.pow(Math.abs(nextPosition.x - this.destination.x), 2) +
						Math.pow(Math.abs(nextPosition.y - this.destination.y), 2)
				);
				if (!newPath) {
					newPath = { direction: path, distance: distance };
				}
				if (this.state === STATE_SCARED) {
					if (distance > newPath.distance) {
						newPath.direction = path;
						newPath.distance = distance;
					}
				} else {
					if (distance < newPath.distance) {
						newPath.direction = path;
						newPath.distance = distance;
					}
				}
			});
			if (newPath) {
				this.direction = newPath.direction;
			} else {
				this.direction = '';
			}

			this.availablePaths = possiblesPath;
		}
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
