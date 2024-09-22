
export default class Line {
	messages: string[];
	interval: number;
	order: ConfigOrder;

	lastUpdated = Date.now();
	messageIndex = 0;

	constructor(data: ConfigLine) {
		this.messages = data.messages;
		this.interval = data.interval;
		this.order = data.order;
	}
	
	getMessage() {
		if ((Date.now() - this.lastUpdated) > this.interval) {
			switch (this.order) {
				case "random":
					this.messageIndex = Math.floor(Math.random() * this.messages.length);
					break;
	
				case "normal":
					this.messageIndex++;
					if (this.messageIndex > (this.messages.length - 1)) {
						this.messageIndex = 0;
					}
					break;
	
				case "reverse":
					this.messageIndex--;
					if (this.messageIndex < 0) {
						this.messageIndex = this.messages.length;
					}
					break;
			}
			this.lastUpdated = Date.now();
		}
	
		return this.messages[this.messageIndex];
	}
}