export const PATH_UP = 'UP';
export const PATH_DOWN = 'DOWN';
export const PATH_LEFT = 'LEFT';
export const PATH_RIGHT = 'RIGHT';
export const PATHS = [PATH_UP, PATH_DOWN, PATH_LEFT, PATH_RIGHT];

export const getNextPosition = ({ position, speed, direction }) => {
	const newPosition = position;
	switch (direction) {
		case PATH_UP:
			newPosition.y -= speed;
			break;
		case PATH_DOWN:
			newPosition.y += speed;
			break;
		case PATH_LEFT:
			newPosition.x -= speed;
			break;
		case PATH_RIGHT:
			newPosition.x += speed;
			break;
		default:
			break;
	}
	return newPosition;
};

export const isReverse = ({ direction, path }) => {
	return (
		direction &&
		((direction === PATH_UP && path === PATH_DOWN) ||
			(direction === PATH_DOWN && path === PATH_UP) ||
			(direction === PATH_RIGHT && path === PATH_LEFT) ||
			(direction === PATH_LEFT && path === PATH_RIGHT))
	);
};
