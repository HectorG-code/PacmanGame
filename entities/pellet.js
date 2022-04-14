export class Pellet {
	constructor({ position, points = 10 }) {
		this.position = position;
		this.radius = 3;
		this.points = points;
	}

	draw(c) {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = 'white';
		c.fill();
		c.closePath();
	}
}

export class PowerUp extends Pellet {
	constructor({ position }) {
		super({ position: position, points: 50 });
		this.radius = 8;
	}
}
