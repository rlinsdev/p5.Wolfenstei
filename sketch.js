// Map
const gamemap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
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
		// This is very cost calculation.
		// const deltaDistY = abs(rayDir.mag() / rayDir.y);
		// const deltaDistX = abs(rayDir.mag() / rayDir.x);

		// Just must be the same proportion. Change the 'Magnitude' to 1
		// rayDir maybe will be zero (0).
		// const deltaDistY = abs(1 / rayDir.y);
		// const deltaDistX = abs(1 / rayDir.x);

		let deltaDistY;
		let deltaDistX;

		// To not divide by zero, force to Y always be less then X
		if (rayDir.x == 0) {
			deltaDistX = 1;
			deltaDistY = 0;
		}  else {
			if (rayDir.y) {
				deltaDistX = abs(1 / rayDir.x);
			}
		}

		// To not divide by zero, force to X always be less then Y
		if (rayDir.y == 0) {
			deltaDistX = 0;
			deltaDistY = 1;
		}  else {
			if (rayDir.x) {
				deltaDistY = abs(1 / rayDir.y);
			}
		}


		// Getting the position of player, but without decimal places
		const mapPos = createVector(floor(pos.x), floor(pos.y));

		let distToSideX;
		let distToSideY;

		let stepY;
		let stepX;

		let perpendicularDist;

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
		// Formula to avoid fish yes. Will calculate the distance player until wall
		if (hitSide == 0) {
			perpendicularDist = abs(wallMapPos.x - pos.x + ((1-stepX)/2))/rayDir.x;
		} else {
			perpendicularDist = abs(wallMapPos.y - pos.y + ((1-stepY)/2))/rayDir.y;
		}

		// Size of wall
		let wallLineHeight = height/perpendicularDist;
		let lineStartY = height/2 - wallLineHeight/2;
		let lineEndY = height/2 + wallLineHeight/2;

		// Change the wall color. If hit 1 side, 1 color, another side, another color
		let color = hitSide ? 255: 128;
		// put the color
		stroke(color, 0, 0);
		// Draw the line (wall)
		line(pixel, lineStartY, pixel, lineEndY);
	}
}
