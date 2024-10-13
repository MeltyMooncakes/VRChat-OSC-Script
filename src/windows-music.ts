import winplayer, { Status, Position, WinPlayer } from "@innei/winplayer-rs/emitter";
import { Song } from "./music";
import { msToString } from "./misc";

const blankMetadata: Metadata = {
	album: "Unknown",
	albumArtist: "Unknown",
	albumArtists: ["Unknown"],
	artist: "Unknown",
	artists: ["Unknown"],
	artData: undefined,
	id: "Unknown",
	length: 0,
	title: "Unknown",
}


// I fucking hate this.
const WindowsPlaybackStatus = {
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(0)": "Closed",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(1)": "Opened",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(2)": "Changing",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(3)": "Stopped",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(4)": "Playing",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(5)": "Paused",
};

// length is in seconds

export class WindowsMusic {
	playerManager: WinPlayer | undefined;
	metadata: Metadata;
	position: number = 0;

	playbackStatus: PlaybackStatus;

	constructor() {
		this.init();
	}

	getSong() {
		console.log(this.metadata);
		const length = (this.metadata?.length || 0) * 1000;
		return {
			album: this.metadata.album,
			artist: this.metadata.artists,
			length,
			stringLength: msToString(length),
			title: this.metadata?.title || "Unknown Song",
			url: "unknown"
		};
	}

	async init() {
		this.playerManager = await winplayer();

		const status = ((status: Status) => {
			console.log("h");
			if (status.metadata !== undefined) {
				this.metadata = status.metadata;
			}

			if (status?.status !== void 0) {
				// @ts-ignore
				this.playbackStatus = WindowsPlaybackStatus[status.status];
			}
		}).bind(this);
		if (this.playerManager) {
			this.playerManager
				.on("PlaybackInfoChanged", status)
				.on("MediaPropertiesChanged", status)
				.on("TimelinePropertiesChanged", (position: Position) => {
					if (position !== undefined) {
						this.position = position.howMuch * 1000;
					}
				});
		}
	}

	updateStatus(status: Status) {
		console.log("h");
		if (status.metadata !== undefined) {
			this.metadata = status.metadata;
		}

		if (status?.status !== void 0) {
			// @ts-ignore
			this.playbackStatus = WindowsPlaybackStatus[status.status];
		}
	}
}