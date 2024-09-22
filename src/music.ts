import { ClientInterface, ProxyObject, sessionBus } from "dbus-next"
import { msToString } from "./misc";

const bus = sessionBus();

interface data {
    baz: number;
    [key: string]: any;
}

export class Song {
	title: string;
	artist: string[];
	album: string;
	url: string;
	length: number;
	stringLength: string;

	constructor(data: data) {
		this.title = data.value["xesam:title"]?.value || "Unknown";

		this.artist = data.value["xesam:artist"]?.value || "Unknown";

		this.album = data.value["xesam:album"]?.value || "Unknown";

		this.url = data.value["xesam:url"]?.value || "Unknown";

		// @ts-ignore
		this.length = parseInt(data.value["mpris:length"].value / 1000n);

		this.stringLength = msToString(this.length);
	}
}

export default class Music {
	proxy: ProxyObject;
	interface: ClientInterface;

	constructor() {
		this._init();
	}

	async _init() {
		this.proxy = await bus.getProxyObject("org.mpris.MediaPlayer2.YoutubeMusic", "/org/mpris/MediaPlayer2");
		this.interface = this.proxy.getInterface("org.freedesktop.DBus.Properties");
	}

	async getProperty(name: string) {
		try {
			return await this.interface.Get("org.mpris.MediaPlayer2.Player", name);
		} catch (e) {
			this._init();
			return await (this.interface.Get("org.mpris.MediaPlayer2.Player", name).catch(() => { return {} }));
		}
	}

	async getSong() {
		return new Song(await this.getProperty("Metadata"));
	}

	async getPosition() {
		const pos = Number((await this.interface.Get("org.mpris.MediaPlayer2.Player", "Position")).value / 1000n);

		return {
			value: pos,
			string: msToString(pos),
		};
	}

	async getPlaybackStatus(): Promise<"Playing" | "Paused" | "Stopped"> {
		return (await this.interface.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus")).value;
	}
};