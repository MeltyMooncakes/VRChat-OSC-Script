import winplayer, { Status, Position, WinPlayer } from "@innei/winplayer-rs/emitter";
import { msToString, WindowsPlaybackStatus } from "./misc";

// length is in seconds

const metadataEmpty = {
	album: "Unknown",
	artist: ["Unknown"],
	length: 0,
	stringLength: "00:00:00",
	title: "Unknown Song",
	url: "unknown"
};

export class WindowsMusic {
	playerManager: WinPlayer | undefined;
	metadata: Metadata;
	position: number = 0;

	playbackStatus: PlaybackStatus;

	constructor() {
		this.init();
	}

	getSong() {
		const length = (this.metadata?.length || 0) * 1000;
		return {
			album: this.metadata?.album || "Unknown",
			artist: this.metadata?.artists || ["Unknown"],
			length,
			stringLength: msToString(length),
			title: this.metadata?.title || "Unknown Song",
			url: "unknown"
		};
	}

	async init() {
		this.playerManager = await winplayer();

		const status = ((status: Status) => {
			// @ts-ignore
			this.metadata = Object.apply(metadataEmpty, status?.metadata || {});
			// @ts-ignore
			this.playbackStatus = WindowsPlaybackStatus?.[status.status] || "Stopped";
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
		if (status.metadata !== undefined) {
			this.metadata = status.metadata;
		}

		if (status?.status !== void 0) {
			// @ts-ignore
			this.playbackStatus = WindowsPlaybackStatus[status.status];
		}
	}
}
