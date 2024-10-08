#!/bin/bash
for dir in ./plugins/*; do
	cd $dir && pnpm build;
done