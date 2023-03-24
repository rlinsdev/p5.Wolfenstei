class InputHandler {
	constructor () {
		this.keys = {};

		this.keys["up"] = 0;
		this.keys["down"] = 0;
		this.keys["left"] = 0;
		this.keys["right"] = 0;
		this.keys["rotateright"] = 0;
		this.keys["rotateright"] = 0;
		this.keys["shoot"] = 0;

	}

	checkKeys() {
		this.keys["up"] = keyIsDown(87) ? 1 : 0; 		//w
		this.keys["down"] = keyIsDown(83) ? 1 : 0; 		//s
		this.keys["left"] = keyIsDown(65) ? 1 : 0; 		//a
		this.keys["right"] = keyIsDown(68) ? 1 : 0; 	//d
		this.keys["shoot"] = keyIsDown(32) ? 1 : 0; 	//[space]

		this.keys["rotateleft"] = keyIsDown(LEFT_ARROW) ? 1 : 0;
		this.keys["rotateright"] = keyIsDown(RIGHT_ARROW) ? 1 : 0;

		if (movedX != 0) {
			let mouseIntensity = map(movedX, 0, 320, 0, 15);

			this.keys["rotateleft"] = (movedX < 0) ? -mouseIntensity: 0;
			this.keys["rotateright"] = (movedX > 0) ? mouseIntensity: 0;
		}
	}

	isKeyDown(key) {
		return boolean(this.keys[key]); // Boolean return
	}

	getKey(key) {
		return this.keys[key]; // Value tp represent intensity
	}
}
