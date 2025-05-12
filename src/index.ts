import { readFileSync } from "fs";
import osc, { Message } from "node-osc"
import Music from "./music";
import Line from "./config";
import { parse } from "yaml";
import { Plugins } from "./plugins";

export class Client {
	inSocket = new osc.Client("127.0.0.1", 9000);
	outSocket = new osc.Server(9001, "127.0.0.1");

	lastSent = 0;
	enabled = false;

	timeoutStart = 0;
	timeoutLength = 0;

	music: Music;
	plugins: Plugins;
	config: ConfigData;
	interval: NodeJS.Timer;

	properties: objectAny = {};

	constructor() {
		this.config = parse(readFileSync("./configs/config.yaml", "utf-8"));

		this.music = new Music(this.config);
		this.plugins = new Plugins(this);
		this.plugins.loadAllPlugins();

		const lines = this.config.lines.map(data => new Line(data));

		this.interval = setInterval(async () => {
			if (!this.config.chatbox) {
				return;
			}

			if (this.timeoutLength > 0 && (Date.now() - this.timeoutStart) < this.timeoutLength) {
				return;
			}

			for (const line of lines) {
				line.getMessage();
			}

			if ((Date.now() - this.lastSent) > this.config.sendInterval) {
				this.lastSent = Date.now();
				this.send(`${await Line.formatMessage(this, lines.map(l => l.getMessage()).join("\n"))}`, true);
			}
		}, 100);
		
		this.outSocket.on("message", m => {
			this.properties[m[0]] = this.properties?.["/avatar/change"] !== void 0
				? {} : m[1];
		});
	}

	/** Starts typing */
	sendTyping(bool = true) {
		this.inSocket.send(new Message("/chatbox/typing", bool));
	}

	/** Sends a message */
	send(message: string, send = false) {
		this.inSocket.send(new Message("/chatbox/input", message, send));
	}

	/** Times out the interval. */
	timeout(time = 5e3) {
		this.timeoutLength = time;
		this.timeoutStart = Date.now();
	}
};

const client = new Client();
