import { Client } from ".";

export class Plugin {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	async start() { };
}

export class Plugins {
	client: Client;
	plugins = [];

	constructor(client: Client) {
		this.client = client;
	}

	async load(name: string) {
		const { Plugin } = await import(`../plugins/${name}/dist/index.js`),
			plugin = new Plugin(this.client);

		console.log(`Loaded plugin: ${name}`);

		plugin.start();
	}
}		