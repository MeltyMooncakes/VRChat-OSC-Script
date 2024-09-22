import OSC from "osc-js";
import { musicEmojis, makeProgressBar } from "./misc";
import Line from "./config";
import { readFileSync } from "fs";
import { OSCChatbox } from "./chatbox";
import { cpu, cpuTemperature, mem, graphics } from "systeminformation";
import osc from "node-osc"
import Music from "./music";

export class Client {
	socket: osc.Client;
	interval: NodeJS.Timer;

	lastSent = 0;
	enabled = false;
	config: ConfigData;
	chatbox: OSCChatbox;
	music: Music;

	constructor() {
		// @ts-ignore
		this.socket = new osc.Client("127.0.0.1", "9000");
		this.chatbox = new OSCChatbox(this);
		this.music = new Music();


		this.config = JSON.parse(readFileSync("./config.json", "utf-8"));
		const lines = this.config.lines.map(data => new Line(data));

		this.interval = setInterval(async () => {
			for (const line of lines) {
				line.getMessage();
			}

			if ((Date.now() - this.lastSent) > 1500) {
				this.lastSent = Date.now();
				this.chatbox.send(`${await this.formatMessage(lines.map(l => l.getMessage()).join("\n"))}`, true);
			}
		}, 100);
	}

	startInterval(): Client {
		return this;
	}

	connect(): Client {
		return this;
	}

	async formatMessage(message: string): Promise<string> {
		const date = new Date(),
			twelvehour = date.getHours() > 11 ? "PM" : "AM",
			hours = date.getHours() - (twelvehour === "PM" ? 12 : 0),
			minutes = `${date.getMinutes()}`;

		// Music stuff
		const song = await this.music.getSong();

		const timeString = `${hours === 0 ? 12 : hours}:${minutes.length === 1 ? "0" : ""}${minutes} ${twelvehour}`,
			musicString = `${musicEmojis[await this.music.getPlaybackStatus()]} ${song.artist.join(" & ")} - ${song.title}`;

		let msg = message
			.replace(/\{time\}/g, timeString)
			.replace(/\{musicPosition\}/g, `${(await this.music.getPosition()).string}/${song.stringLength}`)
			.replace(/\{musicProgressBar\}/g, `[${makeProgressBar((await this.music.getPosition()).value, song.length, 15)}]`)
			.replace(/\{cpuTemp\}/g, `${(await cpuTemperature()).main}°C`)
			.replace(/\{cpuName\}/g,
				`${(await cpu()).brand}`
					.replace(/([0-9]+\-core|processor)/gi, "")
			)
			.replace(/\{gpuName\}/g, `${(await graphics()).controllers[0].model}`)
			.replace(/\{ramTotal\}/g, `${((await mem()).total / 1.074e+9).toFixed(2)}GiB`)
			.replace(/\{ramUsed\}/g, `${((await mem()).active / 1.074e+9).toFixed(2)}GiB`);
		msg = `${msg}${this.config.minimalBackground ? "\u0003\u001f" : ""}`;

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
};



const client = new Client();
client.connect();