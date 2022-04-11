export class Player {
	constructor({ position, velocity, color = 'yellow' }) {
		this.position = position;
		this.velocity = velocity;
		this.newVelocity = velocity;
		this.radius = 15;
		this.collision = false;
		this.color = color;
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
}
