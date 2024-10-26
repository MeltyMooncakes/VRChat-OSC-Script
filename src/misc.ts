export const musicEmojis = {
	Playing: "\u25B6",
	Paused: "⏸",
	Stopped: "⏹",
	Closed: "⏹",
	Opened: "⏸",
	Changing: "⏹",
};

// I fucking hate this.
export const WindowsPlaybackStatus = {
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(0)": "Closed",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(1)": "Opened",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(2)": "Changing",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(3)": "Stopped",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(4)": "Playing",
	"GlobalSystemMediaTransportControlsSessionPlaybackStatus(5)": "Paused",
};


export function msToString(ms: number): string {
	const m = ms / 60000,
		s = `${Math.round((m - Math.trunc(m)) * 60)}`;
	return `${Math.trunc(m)}:${s.length === 1 ? "0" : ""}${s}`;
};

export function makeProgressBar(options: ProgressBarOptions): string {
	if (options.current > options.total) {
		return "";
	}

	const p = options.current / options.total,
		c = p * options.length;

	return options.characters.start
		+ options.characters.before.repeat(Math.max(c - 1, 0))
		+ (c > 1 ? options.characters.thumb : "")
		+ options.characters.after.repeat((1 - p) * options.length)
		+ options.characters.end;
}