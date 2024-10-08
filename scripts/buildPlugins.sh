#!/bin/bash
if [ ! -z "$( ls -A "./plugins" )" ]; then
    for dir in ./plugins/*; do
        cd $dir && pnpm build;
    done
fi