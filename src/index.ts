
import { readFileSync } from "fs";
import { OSCChatbox } from "./chatbox";
import osc from "node-osc"
import Music from "./music";
import Line from "./config";
import { parse } from "smol-toml";

export class Client {
	// @ts-ignore
	socket = new osc.Client("127.0.0.1", "9000");
	
	lastSent = 0;
	enabled = false;
	
	music: Music;
	config: ConfigData;
	chatbox: OSCChatbox;
	interval: NodeJS.Timer;
		
	constructor() {
		// @ts-expect-error
		this.config = parse(readFileSync("./config.json", "utf-8"));

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
};

const client = new Client();