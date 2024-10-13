import { ClientInterface, MessageBus, ProxyObject, sessionBus } from "dbus-next"
import { msToString } from "./misc";
import { platform } from "os";

const MusicPlayerTypes = {
	"YoutubeMusic": "org.mpris.MediaPlayer2.YoutubeMusic",
	"Firefox": "org.mpris.MediaPlayer2.Firefox",
	"VLC": "org.mpris.MediaPlayer2.vlc",
}

class _BlankSong {
	title = "Unknown";
	artist = ["Unknown"];
	album = "Unknown";
	url = "Unknown";
	length = 0;
	stringLength = "0:00";
}

export const BlankSong = new _BlankSong();

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
		this.length = parseInt((data.value["mpris:length"]?.value || 0n) / 1000n);

		this.stringLength = msToString(this.length);
	}
}

export default class Music {
	// proxy: ProxyObject;
	interface: ClientInterface;
	config: ConfigData;
	platform = platform();
	bus: MessageBus;
	windowsMusic: objectAny;

	constructor(config: ConfigData) {
		this.config = config;

		if (this.platform === "linux") {
			this.bus = sessionBus();
			this.getInterface();
		} else {
			this.getInterface();
			console.warn("NOTE: Music information is not currently supported on windows.");
		}
	}

	hasInterface = false;

	async getInterface() {
		if (this.platform !== "linux") {
			if (!this.hasInterface) {
				const { WindowsMusic } = await import(`${__dirname}/windows-music.js`);
				this.windowsMusic = new WindowsMusic();
				this.hasInterface = true;
			}
			return;
		}

		try {
			const proxy = await this.bus.getProxyObject(MusicPlayerTypes[this.config.mediaplayer], "/org/mpris/MediaPlayer2");
			this.hasInterface = true;
			this.interface = proxy.getInterface("org.freedesktop.DBus.Properties");
		} catch (e) {
			this.hasInterface = false;
		}
	}

	async getProperty(name: string) {
		await this.getInterface();
		if (this.hasInterface) {
			return await this.interface.Get("org.mpris.MediaPlayer2.Player", name);
		}
		return "Unknown";
	}

	async getSong() {
		await this.getInterface();
		if (this.hasInterface) {
			if (this.platform !== "linux") {
				return this.windowsMusic.getSong();
			} else {
				return new Song(await this.getProperty("Metadata"));
			}
		}
		return BlankSong;
	}

	async getPosition() {
		await this.getInterface();
		if (this.hasInterface) {
			let pos = 0;
			if (this.platform !== "linux") {
				pos = this.windowsMusic?.position;
			} else {
				pos = Number((await this.interface.Get("org.mpris.MediaPlayer2.Player", "Position")).value / 1000n);
			}

			return {
				value: pos,
				string: msToString(pos),
			};
		}

		return {
			value: 0,
			string: "0:00",
		};
	}

	async getPlaybackStatus(): Promise<PlaybackStatus> {
		await this.getInterface();
		if (this.hasInterface) {
			if (this.platform === "linux") {
				return (await this.interface.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus")).value;
			} else {
				return this.windowsMusic.playbackStatus;
			}
		}

		return "Stopped";
	}
};