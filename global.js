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
