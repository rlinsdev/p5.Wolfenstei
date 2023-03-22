// Map
const gamemap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Possition and direction of player
let pos;
let dir;

let cameraPlane;

// size of screen
const gameWidth = 320; //=> This will be the base to calculate the vectors in rays
const gameHeight = 200;

function setup() {
	// Size of screen. This will generate var height and width globaly
	createCanvas(gameWidth, gameHeight);
	// remove black row to divide frames
	noStroke();

	pos = createVector(5, 5);
	dir = createVector(0, -1); // Dir normalized to 1. Get ease in math calculation
	cameraPlane = createVector(0.66, 0);
}

/*This is the function with a eternal loop*/
function draw() {
	// ceiling
	background(190, 190, 255);

	fill(130);

	// Draw the floor
	rect(0, height / 2, width, height / 2);

	for (let pixel = 0; pixel < width; pixel++) {
		//Formula to get all the pixels in the all width, range from -1 until 1 (range of POV)
		const multiplier = 2 * (pixel / width) - 1;
		// New Small peace of pixel in the range of POV (A slice of the full plane )
		const cameraPixel = p5.Vector.mult(cameraPlane, multiplier);
		// Ray from the Player until the small peace of plane
		const rayDir = p5.Vector.add(dir, cameraPixel);

		// .mag will calculate magnitude of vector. Must be abs. DeltaDist is always positive
		const deltaDistY = abs(rayDir.mag() / rayDir.y);
		const deltaDistX = abs(rayDir.mag() / rayDir.x);

		// Getting the position of player, but without decimal places
		const mapPos = createVector(floor(pos.x), floor(pos.y));

		let distToSideX;
		let distToSideY;

		let stepY;
		let stepX;

		// Rays (FOV) going to left (X)
		if (rayDir.x < 0) {
			distToSideX = (pos.x - mapPos.x) * deltaDistX;
			stepX = -1;
		} else {
			// Going Right
			distToSideX = (mapPos.x + 1 - pos.x) * deltaDistX;
			stepX = 1;
		}

		// Rays (FOV) going to Up (Y)
		if (rayDir.y < 0) {
			distToSideY = (pos.y - mapPos.y) * deltaDistY;
			stepY = -1;
		} else {
			// Going Down
			distToSideY = (mapPos.y + 1 - pos.y) * deltaDistY;
			stepY = 1;
		}


		let hit = false;
		let hitSide;

		// Initialize LineSize with the distance to axis
		let ddaLineSizeX = distToSideX;
		let ddaLineSizeY = distToSideY;

		// Copy vector pos to wallMapPos vector
		let wallMapPos = mapPos.copy();

		// Implementing DDA algorithm
		while (hit == false) {

			if (ddaLineSizeX < ddaLineSizeY) {
				wallMapPos.x += stepX;
				ddaLineSizeX += deltaDistX;
				hitSide = 0;
			} else {
				wallMapPos.y += stepY;
				ddaLineSizeY += deltaDistY;
				hitSide = 1;
			}
			// Check if hit the wall
			if (gamemap[wallMapPos.x][wallMapPos.y] > 0) {
				hit = true;
			}
		}
	}
}
