type ConfigOrder = "normal" | "reverse" | "random" | string;

interface ConfigLine {
	interval: number;
	order: ConfigOrder;
	messages: string[];
};

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
};

interface data {
    baz: number;
    [key: string]: any;
}
