export class Entity {
	constructor({ position, velocity, color = 'yellow' }) {
		this.position = position;
		this.velocity = velocity;
		this.newVelocity = velocity;
		this.radius = 15;
		this.collision = false;
		this.color = color;
	}

	draw(context) {
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
	}

	update(context) {
		this.draw(context);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

export class Ghost extends Entity {
	constructor({ position, velocity, color = 'yellow', refresh = 10 }) {
		super({ position: position, velocity: velocity, color: color });
		this.actual = 0;
		this.refreshTime = refresh;
	}

	getRandomVelocity = () => {
		let possibleVelocity = { x: 0, y: 0 };

		do {
			switch (Math.floor(Math.random() * 4)) {
				case 0:
					possibleVelocity = { x: -5, y: 0 };
					break;
				case 1:
					possibleVelocity = { x: 0, y: -5 };
					break;
				case 2:
					possibleVelocity = { x: 5, y: 0 };
					break;
				case 3:
					possibleVelocity = { x: 0, y: 5 };
					break;
			}
		} while (
			(this.velocity.x === possibleVelocity.x &&
				this.velocity.y === possibleVelocity.y * -1) ||
			(this.velocity.y === possibleVelocity.y &&
				this.velocity.x === possibleVelocity.x * -1)
		);

		this.newVelocity = possibleVelocity;
	};
}

export const player = new Entity({
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
});
export const ghosts = [];
