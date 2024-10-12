#!/bin/bash
if [ ! -z "$( ls -A "./plugins" )" ]; then
	pnpm install $(node ./scripts/listPluginDependencies.js)
    for dir in ./plugins/*; do
        cd $dir && pnpm build;
    done
fi