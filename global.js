export const DEFAULT_SIZE = 40;

export const scoreScr = document.getElementById('playerScore');

export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

canvas.width = 1290;
canvas.height = 1290;

export const calcPosition = (position, offset = 0) => {
	const realPosition = { x: 0, y: 0 };
	realPosition.x = (position.x + offset) * DEFAULT_SIZE;
	realPosition.y = (position.y + offset) * DEFAULT_SIZE;
	return realPosition;
};

export const circleCollideWithRectangle = ({ position, radius, rectangle }) => {
	const padding = rectangle.width / 2 - radius - 1;

	return (
		position.y - radius <= rectangle.position.y + rectangle.height + padding &&
		position.x + radius >= rectangle.position.x - padding &&
		position.y + radius >= rectangle.position.y - padding &&
		position.x - radius <= rectangle.position.x + rectangle.width + padding
	);
};

export const circleCollideWithCircle = ({ circle1, circle2 }) => {
	return (
		Math.hypot(
			circle2.position.x - circle1.position.x,
			circle2.position.y - circle1.position.y
		) <
		circle1.radius + circle2.radius
	);
};
