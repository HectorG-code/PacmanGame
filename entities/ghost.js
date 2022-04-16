import {
	getLastPlayerPosition,
	getNextPosition,
	isReverse,
	PATHS,
} from '../directions.js';

const STATE_STARTED = 'started';
const STATE_SCARED = 'scared';
const MODE_SCATTER = 'scatter';
const MODE_CHASE = 'chase';
const STATE_ALIVE = 'alive';
const STATE_DEAD = 'dead';

export class Ghost {
	state = STATE_STARTED;
	mode = MODE_SCATTER;
	color = 'white';
	speed = 5;
	radius = 15;
	scaredTimer = null;
	direction = '';
	collisions = [];
	availablePaths = [];
	destination = null;

	constructor({
		position,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		this.position = position;
		this.destination = { ...exitPosition };
		this.exitPosition = { ...exitPosition };
		this.scatterPosition = { ...scatterPosition };
		this.respawnPosition = { ...respawnPosition };
		this.modeCycle(3000 + Math.floor(Math.random() * 5000));
	}

	modeCycle(time) {
		setTimeout(() => {
			if (this.mode === MODE_SCATTER) {
				this.mode = MODE_CHASE;
				this.modeCycle(10000 + Math.floor(Math.random() * 5000));
			} else {
				this.mode = MODE_SCATTER;
				this.setDestination(this.scatterPosition);
				this.modeCycle(3000 + Math.floor(Math.random() * 5000));
			}
		}, time);
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

	setDestination(destination) {
		this.destination = { ...destination };
	}

	isDestinationReached() {
		return (
			this.position.x === this.destination.x &&
			this.position.y === this.destination.y
		);
	}

	reachDestination() {
		switch (this.state) {
			case STATE_STARTED:
				this.state = STATE_ALIVE;
				this.setDestination(this.scatterPosition);
				break;
			case STATE_ALIVE:
				break;
			case STATE_DEAD:
				this.state = STATE_STARTED;
				this.setDestination(this.exitPosition);
				break;
		}
	}

	setScared() {
		if (this.state === STATE_DEAD) return;
		clearTimeout(this.scaredTimer);
		this.state = STATE_SCARED;
		this.scaredTimer = setTimeout(() => {
			this.endScared(STATE_ALIVE);
		}, 5000);
	}

	endScared(state) {
		this.state = state;
		clearTimeout(this.scaredTimer);
	}

	setDead = () => {
		this.endScared(STATE_DEAD);
		this.setDestination(this.respawnPosition);
	};

	changeDirection() {
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
				if (this.state === STATE_SCARED) {
					this.setDestination(getLastPlayerPosition());
				}
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
	}

	isAlive = () => {
		if (this.state === STATE_ALIVE) return true;
		return false;
	};

	collisionPlayer = () => {
		if (this.state === STATE_SCARED) this.setDead();
		return;
	};
}

class PinkGhost extends Ghost {
	constructor({
		position,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		super({
			position: position,
			exitPosition: exitPosition,
			scatterPosition: scatterPosition,
			respawnPosition: respawnPosition,
		});
		this.color = 'pink';
	}
}

class RedGhost extends Ghost {
	constructor({
		position,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		super({
			position: position,
			exitPosition: exitPosition,
			scatterPosition: scatterPosition,
			respawnPosition: respawnPosition,
		});
		this.color = 'red';
	}

	changeDirection() {
		if (this.state === STATE_ALIVE && this.mode === MODE_CHASE) {
			this.setDestination(getLastPlayerPosition());
		}
		super.changeDirection();
	}
}

class OrangeGhost extends Ghost {
	constructor({
		position,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		super({
			position: position,
			exitPosition: exitPosition,
			scatterPosition: scatterPosition,
			respawnPosition: respawnPosition,
		});
		this.color = 'orange';
	}

	changeDirection() {
		if (this.state === STATE_ALIVE && this.mode === MODE_CHASE) {
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
		} else {
			super.changeDirection();
		}
	}
}

class CyanGhost extends Ghost {
	constructor({
		position,
		exitPosition = { x: 0, y: 0 },
		scatterPosition = { x: 0, y: 0 },
		respawnPosition = { x: 0, y: 0 },
	}) {
		super({
			position: position,
			exitPosition: exitPosition,
			scatterPosition: scatterPosition,
			respawnPosition: respawnPosition,
		});
		this.color = 'cyan';
	}
}

const ghostClasses = {
	RedGhost,
	PinkGhost,
	CyanGhost,
	OrangeGhost,
};

export class DynamicGhost {
	constructor(ghostClass, opts) {
		return new ghostClasses[ghostClass](opts);
	}
}
