
class RayEngine {
	constructor(w, h, map) {
		this.width = w;
		this.height = h;
		this.map = map.map;

		this.frameBuffer = createGraphics(this.width, this.height);

		this.pos = createVector(5, 5);
		this.dir = createVector(0, -1); // Dir normalized to 1. Get ease in math calculation
		this.cameraPlane = createVector(0.66, 0);

		this.multiplier = null;
		this.cameraPixel = null;
		this.rayDir = null;

		this.deltaDistX = null;
		this.deltaDistY = null;
		this.distToSideX = null;
		this.distToSideY = null;
		this.stepY = null;
		this.stepX = null;
		this.mapPos = null;

		this.hitSide = null;
		this.wallHitMapPos = null;
		this.perpendicularDist = null;
		this.wallColor = null;

		this.movementSpeed = 5;
		this.rotationSpeed = 0;

		this.velocity = createVector(0, 0);
		this.strafeVelocity = createVector(0, 0);
	}

	generateFrame() {

		this.updateInput();

		// ceiling
		this.frameBuffer.background(190, 190, 255);
		this.frameBuffer.fill(130);

		// Draw the floor
		this.frameBuffer.rect(0, this.height / 2, this.width, this.height / 2);

		for (let pixel = 0; pixel < this.width; pixel++) {
			this.calculateCurrentRay(pixel);

			// Getting the position of player, but without decimal places
			this.mapPos = createVector(floor(this.pos.x), floor(this.pos.y));

			this.calculateDDAVariables();
			this.performDDA();
			this.calculatePerpendicularDist();
			this.calculateWallColor();
			this.drawVerticalLine(pixel);
		}
	}

	calculateCurrentRay(xpos) {

		//Formula to get all the pixels in the all width, range from -1 until 1 (range of POV)
		this.multiplier = 2 * (xpos / this.width) - 1;
		// New Small peace of pixel in the range of POV (A slice of the full plane )
		this.cameraPixel = p5.Vector.mult(this.cameraPlane, this.multiplier);
		// Ray from the Player until the small peace of plane
		this.rayDir = p5.Vector.add(this.dir, this.cameraPixel);
	}

	calculateDDAVariables() {
		this.deltaDistY = abs(1 / this.rayDir.y);
		this.deltaDistX = abs(1 / this.rayDir.x);

		// Rays (FOV) going to left (X)
		if (this.rayDir.x < 0) {
			this.distToSideX = (this.pos.x - this.mapPos.x) * this.deltaDistX;
			this.stepX = -1;
		} else {
			// Going Right
			this.distToSideX = (this.mapPos.x + 1 - this.pos.x) * this.deltaDistX;
			this.stepX = 1;
		}

		// Rays (FOV) going to Up (Y)
		if (this.rayDir.y < 0) {
			this.distToSideY = (this.pos.y - this.mapPos.y) * this.deltaDistY;
			this.stepY = -1;
		} else {
			// Going Down
			this.distToSideY = (this.mapPos.y + 1 - this.pos.y) * this.deltaDistY;
			this.stepY = 1;
		}
	}

	performDDA() {
		let hit = false;

		// Initialize LineSize with the distance to axis
		let ddaLineSizeY = this.distToSideY;
		let ddaLineSizeX = this.distToSideX;

		// Copy vector pos to wallHitMapPos vector
		this.wallHitMapPos = this.mapPos.copy();

		// Implementing DDA algorithm
		while (hit == false) {

			if (ddaLineSizeX < ddaLineSizeY) {
				this.wallHitMapPos.x += this.stepX;
				ddaLineSizeX += this.deltaDistX;
				this.hitSide = 0;
			} else {
				this.wallHitMapPos.y += this.stepY;
				ddaLineSizeY += this.deltaDistY;
				this.hitSide = 1;
			}
			// Check if hit the wall
			if (this.map[this.wallHitMapPos.x][this.wallHitMapPos.y] > 0) {
				hit = true;
			}
		}
	}

	calculatePerpendicularDist() {
		if (this.hitSide == 0) {
			this.perpendicularDist = abs(this.wallHitMapPos.x - this.pos.x + ((1-this.stepX)/2))/this.rayDir.x;
		} else {
			this.perpendicularDist = abs(this.wallHitMapPos.y - this.pos.y + ((1-this.stepY)/2))/this.rayDir.y;
		}
	}

	calculateWallColor() {
		this.wallColor = this.hitSide ? 255: 128;
	}

	drawVerticalLine(xpos) {
		// Size of wall
		let wallLineHeight = this.height / this.perpendicularDist;
		let lineStartY = this.height/2 - wallLineHeight/2;
		let lineEndY = this.height/2 + wallLineHeight/2;

		// Change the wall color. If hit 1 side, 1 color, another side, another color
		// let color = hitSide ? 255: 128;
		// put the color
		this.frameBuffer.stroke(this.wallColor, 0, 0);
		// Draw the line (wall)
		this.frameBuffer.line(xpos, lineStartY, xpos, lineEndY);
	}

	// Walk
	walkUp() {
		this.velocity.set(this.dir);
		this.velocity.mult(this.movementSpeed);
	}
	walkDown() {
		this.velocity.set(this.dir);
		this.velocity.mult(-this.movementSpeed);
	}
	stopWalking() {
		this.velocity.mult(0);
	}

	// Strafe
	strafeRight() {
		this.strafeVelocity.set(this.dir);
		this.strafeVelocity.rotate(PI/2);
		this.strafeVelocity.mult(this.movementSpeed);
	}
	strafeLeft() {
		this.strafeVelocity.set(this.dir);
		this.strafeVelocity.rotate(-PI/2);
		this.strafeVelocity.mult(this.movementSpeed);
	}
	stopStrafe() {
		this.strafeVelocity.mult(0);
	}

	// Rotation
	rotationRight() {
		this.rotationSpeed = 3;
	}
	rotationLeft() {
		this.rotationSpeed = -3;
	}
	stopRotation() {
		this.rotationSpeed = 0;
	}

	updateInput() {
		this.velocity.mult(1/60); //60 frame per second
		this.strafeVelocity.mult(1/60); //60 frame per second
		this.pos.add(this.velocity);
		this.pos.add(this.strafeVelocity);

		// Must rotate direction and camera plane
		this.dir.rotate(this.rotationSpeed/60);
		this.cameraPlane.rotate(this.rotationSpeed/60); // If you do not rotate the plane, when rotate, the wall begin to be far away
	}
}
