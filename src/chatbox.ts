import OSC from "osc-js";
import { Client } from ".";

export class OSCChatbox {
	client: Client;

	constructor(client: Client) {
		this.client = client;
	}

    sendTyping() {
		// @ts-ignore
        this.client.socket.send("/chatbox/typing", true);
    }

    send(message: string, send = false) {
		// @ts-ignore
        this.client.socket.send("/chatbox/input", message, send);
    }
}