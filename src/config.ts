import { Client } from ".";
import { musicEmojis, makeProgressBar } from "./misc";
import { cpu, cpuTemperature, mem, graphics } from "systeminformation";

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

	static async formatMessage(client: Client, message: string): Promise<string> {
		// Music stuff
		const song = await client.music.getSong();

		const musicString = `${musicEmojis[await client.music.getPlaybackStatus()]} ${[song.artist].flat().join(" & ")} - ${song.title}`;

		let msg = message
			.replace(/\{time\}/g, new Intl.DateTimeFormat("en-US", { minute: "numeric", hour: "numeric" }).format(new Date()))
			.replace(/\{musicPosition\}/g, `${(await client.music.getPosition()).string}/${song.stringLength}`)
			.replace(/\{musicProgressBar\}/g, `[${makeProgressBar((await client.music.getPosition()).value, song.length, 15)}]`)
			.replace(/\{cpuTemp\}/g, `${(await cpuTemperature()).main}°C`)
			.replace(/\{cpuName\}/g,
				`${(await cpu()).brand}`
					.replace(/([0-9]+\-core|processor)/gi, "")
			)
			.replace(/\{gpuName\}/g, `${(await graphics()).controllers[0].model}`)
			.replace(/\{ramTotal\}/g, `${((await mem()).total / 1.074e+9).toFixed(2)}GiB`)
			.replace(/\{ramUsed\}/g, `${((await mem()).active / 1.074e+9).toFixed(2)}GiB`);
		msg = `${msg}${client.config.minimalBackground ? "\u0003\u001f" : ""}`;

		// BETTER WAY: get remaining available length before and put it there using regex                                                
		msg = msg.replace(
			/\{music\}/g,
			musicString.slice(
				0,
				msg.replace(/\{music\}/g, musicString).length > 144
					? 144 - msg.replace(/\{music\}/g, musicString).length
					: musicString.length
			));
		return msg;
	}
}