export const musicEmojis = {
	Playing: "\u25B6",
	Paused: "⏸",
	Stopped: "⏹",
};

export function msToString(ms: number): string {
	const m = ms / 60000,
		s = `${Math.round((m - Math.trunc(m)) * 60)}`;
	return `${Math.trunc(m)}:${s.length === 1 ? "0" : ""}${s}`;
};

export function makeProgressBar(current: number, total: number, length: number): string {
	if (current > total) {
		return "";
	}

	const p = current / total,
		c = p * length;
	return `${"─".repeat(Math.max(c - 1, 0))}${c > 1 ? "🔘" : ""}${"     ".repeat((1 - p) * length)}`
}