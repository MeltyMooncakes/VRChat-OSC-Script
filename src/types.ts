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

	lines: ConfigLine[];

	progressBar: {
		characters: ProgressBarCharacters;
		length: number;
	};
};

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
	characters: ProgressBarCharacters
}