
import { readFileSync } from "fs";
import { OSCChatbox } from "./chatbox";
import osc from "node-osc"
import Music from "./music";
import Line from "./config";

export class Client {
	socket: osc.Client;
	interval: NodeJS.Timer;

	lastSent = 0;
	enabled = false;
	config: ConfigData;
	chatbox: OSCChatbox;
	music: Music;

	constructor() {
		this.config = JSON.parse(readFileSync("./config.json", "utf-8"));

		// @ts-ignore
		this.socket = new osc.Client("127.0.0.1", "9000");
		this.chatbox = new OSCChatbox(this);
		this.music = new Music(this.config);


		const lines = this.config.lines.map(data => new Line(data));

		this.interval = setInterval(async () => {
			for (const line of lines) {
				line.getMessage();
			}

			if ((Date.now() - this.lastSent) > 1500) {
				this.lastSent = Date.now();
				this.chatbox.send(`${await Line.formatMessage(this, lines.map(l => l.getMessage()).join("\n"))}`, true);
			}
		}, 100);
	}

	startInterval(): Client {
		return this;
	}

	connect(): Client {
		return this;
	}
};



const client = new Client();
client.connect();