// Map
const gamemap = [
	[1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1]
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

	pos = createVector(5,5);
	dir = createVector(0,-1);
	cameraPlane = createVector(0.66,0);
  }

  /*This is the function with a ethernal loop*/
  function draw() {
	// ceiling
	background(190,190,255);

	fill(130);

	// Draw the floor
	rect(0,height/2, width, height/2);

	for (let pixel = 0;pixel < width; pixel++) {
	  //Formula to get all the pixels in the all width, range from -1 until 1 (range of POV)
	  const multiplier = 2 * (pixel/width) -1;
	  // New Small peace of pixel in the range of POV (A slice of the full plane )
	  const cameraPixel = p5.Vector.mult(cameraPlane, multiplier);
	  // Ray from the Player until the small peace of plane
	  const rayDir = p5.Vector.add(dir, cameraPixel);

	  // .mag will calculate magnitude of vector
	  const deltaDistX = rayDir.mag()/rayDir.x
	  const deltaDistY = rayDir.mag()/rayDir.y


	}
  }
