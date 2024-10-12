const { readFileSync, readdirSync } = require("node:fs");

let dependencies = [];

function listDependency(dir, version = false) {
	const plugin = JSON.parse(readFileSync(`./plugins/${dir}/package.json`));
	dependencies.push(...Object.entries(plugin.dependencies).map(p => version ? `${p[0]}@${p[1]}` : p[0]));
}

if (process.argv[2] !== void 0) {
	listDependency(process.argv[2], false);
} else {
	for (const dir of readdirSync("./plugins")) {
		listDependency(dir, true);
	}
}

console.log(...dependencies);