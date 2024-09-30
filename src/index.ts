
import { readFileSync } from "fs";
import osc, { Message } from "node-osc"
import Music from "./music";
import Line from "./config";
import { parse } from "yaml";

export class Client {
	// @ts-ignore
	socket = new osc.Client("127.0.0.1", "9000");
	
	lastSent = 0;
	enabled = false;

	timeoutStart = 0;
	timeoutLength = 0;
	
	music: Music;
	config: ConfigData;
	interval: NodeJS.Timer;
		
	constructor() {	
		this.config = parse(readFileSync("./config.yaml", "utf-8"));

		this.music = new Music(this.config);


		const lines = this.config.lines.map(data => new Line(data));

		this.interval = setInterval(async () => {
			if (this.timeoutLength > 0 && (Date.now() - this.timeoutStart) < this.timeoutLength) {
				return;
			}

			for (const line of lines) {
				line.getMessage();
			}

			if ((Date.now() - this.lastSent) > 1500) {
				console.log(Date.now() - this.lastSent);
				this.lastSent = Date.now();
				this.send(`${await Line.formatMessage(this, lines.map(l => l.getMessage()).join("\n"))}`, true);
			}
		}, 100);
	}
	

	/** Starts typing */
    sendTyping(bool = true) {
        this.socket.send(new Message("/chatbox/typing", bool));
    }

	/** Sends a message */
    send(message: string, send = false) {
        this.socket.send(new Message("/chatbox/input", message, send));
    }

	/** Times out the interval. */
	timeout(time = 5e3) {
		this.timeoutLength = time;
		this.timeoutStart = Date.now();
	}
};

const client = new Client();