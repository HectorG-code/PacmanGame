export class Boundary {
	constructor({ position, image, size }) {
		this.position = position;
		this.width = size.width;
		this.height = size.height;
		this.image = image;
	}

	draw(c) {
		c.drawImage(this.image, this.position.x, this.position.y);
	}
}
