type ConfigOrder = "normal" | "reverse" | "random" | string;

interface ConfigLineObjectA {
	interval: number;
	order: ConfigOrder;
	messages: string[];
};

interface ConfigLineObjectB {
	message: string;
}

type ConfigLine = ConfigLineObjectA | ConfigLineObjectB;

interface ConfigData {
	/**
	 * Whether to have the in-game chatbox have a small background (true) or regular background (false).
	 */
	minimalBackground: boolean;

	/**
	 * The kind of music player you use.
	 * These are the only supported ones as of now.
	 */
	mediaplayer: "YoutubeMusic" | "Firefox";

	/**
	 * Whether the chatbox is enabled.
	 */
	chatbox: boolean;

	lines: ConfigLine[];

	progressBar: {
		characters: ProgressBarCharacters;
		length: number;
	};
};

interface objectAny {
	[key: string]: any;
}

interface data {
	baz: number;
	[key: string]: any;
}

interface ProgressBarCharacters {
	start: "├";
	before: "─";
	thumb: "🔘";
	after: "─";
	end: "┤";
}

interface ProgressBarOptions {
	current: number;
	total: number;
	length: number;
	characters: ProgressBarCharacters;
}

interface ArtData {
	data: Buffer;
	mimetype: string;
}

interface Metadata {
	album?: string;
	albumArtist?: string;
	albumArtists?: Array<string>;
	artist: string;
	artists: Array<string>;
	artData?: ArtData;
	id?: string;
	length: number;
	title: string;
}

type PlaybackStatus =
	"Closed"
	| "Opened"
	| "Changing"
	| "Stopped"
	| "Playing"
	| "Paused";