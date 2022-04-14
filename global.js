export const scoreScr = document.getElementById('playerScore');

export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

canvas.width = 1290;
canvas.height = 1290;

export const DEFAULT_SIZE = 40;
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
	}
	return newPosition;
};
