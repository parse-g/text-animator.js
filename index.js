class Animation {
	static sleepTimeout;
	static sleep(ms) {
		clearInterval(Animation.sleepTimeout);
		return new Promise(
			(resolve) => (Animation.sleepTimeout = setTimeout(resolve, ms))
		);
	}
	constructor(runFunction, name) {
		this.run = runFunction;
		this.name = name;
	}
}

class Animator {
	constructor(animatorName, animations) {
		this.name = animatorName;
		this.animationsList = [];
		animations.map((animation) => {
			this[animation.name] = animation;
			this.animationsList.push(animation.name);
		});
	}

	help() {
		const separator = "\n-> ";
		const helpText = `Welcome! The "${this.name}" Animator supports animations:${separator}`;
		const totalAnimations = this.animationsList.join(separator);
		return helpText + totalAnimations;
	}
}

const printAnimation = new Animation(async (settings, callback) => {
	const { animationTime, text, repeat, direction } = settings;

	const animateForward = async () => {
		let accumulator = "";
		for (let index = 0; index < text.length; index++) {
			const timeToWait = animationTime / text.length;

			await Animation.sleep(timeToWait);
			accumulator += text[index];
			callback(accumulator);
		}
	};

	const animateBackward = async () => {
		let accumulator = text;
		for (let index = 0; index < text.length; index++) {
			const timeToWait = animationTime / text.length;

			await Animation.sleep(timeToWait);
			accumulator = accumulator.slice(0, -1);
			callback(accumulator);
		}
	};
	const animateBoth = async () => {
		await animateForward();
		await animateBackward();
	};

	const animate =
		direction === "forward"
			? animateForward
			: direction === "backward"
			? animateBackward
			: direction === "both"
			? animateBoth
			: animateForward;

	if (repeat === "infinite") {
		while (true) {
			await animate();
		}
	} else {
		for (let indexRepeat = 0; indexRepeat < repeat; indexRepeat++) {
			await animate();
		}
	}
}, "print");
const theAnimator = new Animator("One-line multi Animator", [printAnimation]);
export { Animation, Animator, theAnimator };
