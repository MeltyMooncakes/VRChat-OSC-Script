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

	lines: ConfigLine[];
};