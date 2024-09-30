
import { readFileSync } from "fs";
import osc, { Message } from "node-osc"
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
	interval: NodeJS.Timer;
		
	constructor() {
		// @ts-expect-error
		this.config = parse(readFileSync("./config.toml", "utf-8"));

		this.music = new Music(this.config);


		const lines = this.config.lines.map(data => new Line(data));

		this.interval = setInterval(async () => {
			for (const line of lines) {
				line.getMessage();
			}

			if ((Date.now() - this.lastSent) > 1500) {
				this.lastSent = Date.now();
				this.send(`${await Line.formatMessage(this, lines.map(l => l.getMessage()).join("\n"))}`, true);
			}
		}, 100);
	}
	

    sendTyping(bool = true) {
        this.socket.send(new Message("/chatbox/typing", bool));
    }

    send(message: string, send = false) {
        this.socket.send(new Message("/chatbox/input", message, send));
    }
};

const client = new Client();