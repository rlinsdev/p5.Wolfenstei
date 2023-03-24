class InputHandler {
	constructor () {
		this.keys = {};

		this.keys["up"] = false;
		this.keys["down"] = false;
		this.keys["left"] = false;
		this.keys["right"] = false;
		this.keys["rotateright"] = false;
		this.keys["rotateright"] = false;
		this.keys["shoot"] = false;

	}

	checkKeys() {
		this.keys["up"] = keyIsDown(87) ? true : false; 	//w
		this.keys["down"] = keyIsDown(83) ? true : false; 	//s
		this.keys["left"] = keyIsDown(65) ? true : false; 	//a
		this.keys["right"] = keyIsDown(68) ? true : false; 	//d
		this.keys["shoot"] = keyIsDown(32) ? true : false; 	//[space]

		this.keys["rotateleft"] = keyIsDown(LEFT_ARROW) ? true : false;
		this.keys["rotateright"] = keyIsDown(RIGHT_ARROW) ? true : false;

		if (movedX != 0) {
			this.keys["rotateleft"] = (movedX < 0) ? true: false;
			this.keys["rotateright"] = (movedX > 0) ? true: false;
		}
	}

	isKeyDown(key) {
		return this.keys[key];
	}
}
