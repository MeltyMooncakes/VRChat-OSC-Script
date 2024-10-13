import { Client } from ".";
import { musicEmojis, makeProgressBar } from "./misc";
import { cpu, cpuTemperature, mem, graphics } from "systeminformation";
import { BlankSong } from "./music";

export default class Line {
	messages: string[];
	interval: number;
	order: ConfigOrder;

	lastUpdated = Date.now();
	messageIndex = 0;

	constructor(data: ConfigLine) {
		if ("message" in data !== false) {
			this.messages = [data.message];
			this.interval = 1e3;
			this.order = "normal";
		} else {
			this.messages = data.messages;
			this.interval = data.interval;
			this.order = data.order;
		}
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
		const variables = [...message.matchAll(/(?<=\{)[a-z0-9]+(?=\})/gi)].map(m => m[0]);
		let msg = `${message}${client.config.minimalBackground ? "\u0003\u001f" : ""}`,
			ramUsed = 0,
			ramTotal = 0,
			song = BlankSong;

		if (variables.filter(c => /ram(Used|Percentage|Total)/i.test(c)).length > 0) {
			ramTotal = Number(((await mem()).total / 1.074e+9).toFixed(2));
			ramUsed = Number(((await mem()).active / 1.074e+9).toFixed(2));
		}

		if (variables.filter(c => /music(Position|ProgressBar)?/i.test(c)).length > 0) {
			song = await client.music.getSong();
		}

		for await (const variable of variables) {
			switch (variable) {
				case "time":
					msg = msg.replace(/\{time\}/g, new Intl.DateTimeFormat("en-US", { minute: "numeric", hour: "numeric" }).format(new Date()));
					break;
				case "cpuTemp":
					msg = msg.replace(/\{cpuTemp\}/g, `${(await cpuTemperature()).main}°C`);
					break;
				case "cpuName":
					msg = msg.replace(/\{cpuName\}/g, `${(await cpu())?.brand}`.replace(/([0-9]+\-core|processor)/gi, ""));
					break;
				case "gpuName":
					msg = msg.replace(/\{gpuName\}/g, `${(await graphics())?.controllers?.[0]?.model}`);
					break;
				case "ramTotal":
					msg = msg.replace(/\{ramTotal\}/g, `${ramTotal}GiB`);
					break;
				case "ramUsed":
					msg = msg.replace(/\{ramUsed\}/g, `${ramUsed}GiB`);
					break;
				case "ramPercentage":
					msg = msg.replace(/\{ramPercentage\}/g, `${((ramUsed / ramTotal) * 100).toFixed(1)}%`);
					break;
				case "musicPosition":
					msg = msg.replace(/\{musicPosition\}/g, `${(await client.music.getPosition()).string}/${song.stringLength}`);
					break;
				case "musicProgressBar":
					msg = msg.replace(/\{musicProgressBar\}/g, `${makeProgressBar({
						characters: client.config.progressBar.characters,
						current: (await client.music.getPosition()).value,
						total: song.length,
						length: client.config.progressBar.length
					})}`);
					break;
				case "pluginList":
					console.log(client.plugins.plugins);
					msg = msg.replace(/\{pluginList\}/g, `${client.plugins.plugins.map(p => p.name).join(", ")}`);
					break;
				case "pluginCount":
					msg = msg.replace(/\{pluginCount\}/g, `${client.plugins.plugins.length}`);
					break;
			}
		}

		// not in switch statement cuz must be last
		if (variables.includes("music")) {
			const stringA = `${musicEmojis[await client.music.getPlaybackStatus()]} `,
				stringB = `${[song?.artist || ""].flat().join(" & ")} - ${song.title}`;
			msg = msg.replace(/\{music\}/g, `${stringA}${stringB.slice(0, 144 - (msg.length + stringA.length - 7))}`)
		}

		for (const plugin of client.plugins.plugins) {
			msg = await plugin.formatMessage(msg);
		}

		return msg;
	}
}