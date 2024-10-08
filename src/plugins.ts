import { readdirSync } from "fs";
import { Client } from ".";

class Plugin {
	// @ts-ignore
	client: Client;
	// @ts-ignore
	constructor(client: Client) {
		this.client = client;
	}
	
	async start() {};

	async formatMessage(message: string): Promise<string> {
		return message;
	}
}

export class Plugins {
	client: Client;
	plugins: Plugin[] = [];

	constructor(client: Client) {
		this.client = client;
	}

	// If someone can come up with a better way of doing this please do so.
	async load(name: string) {
		const { Plugin } = await import(`../plugins/${name}/dist/index.js`),
			plugin = new Plugin(this.client);

		console.log(`Loaded plugin: ${name}`);

		plugin.start();
	}

	async loadAllPlugins() {
		console.log(`Loading all plugins...`);

		for (const name of readdirSync("./plugins")) {
			return await this.load(name);
		}
	}
}		