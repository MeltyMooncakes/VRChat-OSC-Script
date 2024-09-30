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
		// @ts-ignore this is some weird ass bug with the thing, idk why it does this despite the syntax being correct but whatever :/
        this.client.socket.send("/chatbox/input", message, send);
    }
}