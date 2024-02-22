#!/bin/bash

# Copyright(c) 2024 Alex313031

YEL='\033[1;33m' # Yellow
CYA='\033[1;96m' # Cyan
RED='\033[1;31m' # Red
GRE='\033[1;32m' # Green
c0='\033[0m' # Reset Text
bold='\033[1m' # Bold Text
underline='\033[4m' # Underline Text

# Error handling
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "${RED}Failed $*"; }

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to clean Atom-ng artifacts and node_modules.${c0}\n" &&
	printf "\n"
}
case $1 in
	--help) displayHelp; exit 0;;
esac

printf "\n" &&
printf "${bold}${GRE}Script to clean Atom-ng artifacts and node_modules.${c0}\n" &&

sleep 1 &&

printf "\n" &&
printf "${bold}${YEL} Cleaning artifacts, node_modules, and build directory...${c0}\n" &&
rm -rfv ./docs/output &&
rm -rf ./dot-atom/packages/atom-ng-browser/node_modules &&
rm -rf ./dot-atom/packages/minimap/node_modules &&
rm -rfv ./dot-atom/packages/minimap/.parcel-cache &&
rm -rfv ./dot-atom/packages/minimap/dist/main.js &&
npm run clean &&
tput sgr0
