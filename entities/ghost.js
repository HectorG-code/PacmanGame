export class Ghost {
	constructor({ position, velocity, color, refresh = 10 }) {
		this.position = position;
		this.velocity = velocity;
		this.newVelocity = velocity;
		this.color = color;
		this.radius = 15;
		this.actual = 0;
		this.refreshTime = refresh;
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
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
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
