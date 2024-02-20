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

export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to bootstrap \`dot-atom/packages\`${c0}\n" &&
	printf "${bold}${YEL}Use the --linux flag for Linux.${c0}\n" &&
	printf "${bold}${YEL}Use the --win flag for Windows (in bash)${c0}\n" &&
	printf "${bold}${YEL}Use the --mac flag for MacOS (in bash)${c0}\n" &&
	printf "${bold}${YEL}Use the --sse4 flag for Linux (SSE4 Version).${c0}\n" &&
	printf "${bold}${YEL}Use the --win-sse4 flag for Linux (SSE4 Version).${c0}\n" &&
	printf "${bold}${YEL}Use the --help flag to show this help${c0}\n" &&
	printf "\n"
}
case $1 in
	--help) displayHelp; exit 0;;
esac

initLinux () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping \`dot-atom/packages\` with \`npm install\`...${c0}\n" &&
printf "\n" &&

# Workaround for git:// URLs
if [ -e ~/.gitconfig ]
  then
  cp -i -v ~/.gitconfig ~/.gitconfig_bak
fi
cp -v ./gitconfig ~/.gitconfig &&
printf "\n" &&

cd ./packages/atom-material-ui &&
npm run build && cd ..&&
cd atom-material-syntax-dark &&
npm run build && cd .. && cd .. &&

cd ./dot-atom/packages &&
cd atom-ng-browser &&
npm run build && cd .. &&
cd color-picker &&
npm run build && cd .. &&
cd minimap && npm run build &&
cd .. && cd .. && cd .. &&

printf "\n" &&
rm -v ~/.gitconfig &&
printf "\n"
}
case $1 in
	--linux) initLinux; exit 0;;
esac

initLinuxSSE4 () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -s" &&
export VERBOSE=1 &&
export V=1 &&

# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&
# Use upstream Electron
export ELECTRON_SSE4=1 &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping \`dot-atom/packages\` with \`npm install\` (SSE4 Version)...${c0}\n" &&
printf "\n" &&

# Workaround for git:// URLs
if [ -e ~/.gitconfig ]
  then
  cp -i -v ~/.gitconfig ~/.gitconfig_bak
fi
cp -v ./gitconfig ~/.gitconfig &&
printf "\n" &&

cd ./packages/atom-material-ui &&
npm run build && cd ..&&
cd atom-material-syntax-dark &&
npm run build && cd .. && cd .. &&

cd ./dot-atom/packages &&
cd atom-ng-browser &&
npm run build && cd .. &&
cd color-picker &&
npm run build && cd .. &&
cd minimap && npm run build &&
cd .. && cd .. && cd .. &&

printf "\n" &&
rm -v ~/.gitconfig &&
printf "\n"
}
case $1 in
	--sse4) initLinuxSSE4; exit 0;;
esac

initWin () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping \`dot-atom/packages\` with \`npm install\`...${c0}\n" &&
printf "\n" &&

# Workaround for git:// URLs
if [ -e ~/.gitconfig ]
  then
  cp -i -v ~/.gitconfig ~/.gitconfig_bak
fi
cp -v ./gitconfig ~/.gitconfig &&
printf "\n" &&

cd ./packages/atom-material-ui &&
npm run build && cd ..&&
cd atom-material-syntax-dark &&
npm run build && cd .. && cd .. &&

cd ./dot-atom/packages &&
cd atom-ng-browser &&
npm run build && cd .. &&
cd color-picker &&
npm run build && cd .. &&
cd minimap && npm run build &&
cd .. && cd .. && cd .. &&

printf "\n"
}
case $1 in
	--win) initWin; exit 0;;
esac

initWinSSE4 () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -s" &&
export VERBOSE=1 &&
export V=1 &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping \`dot-atom/packages\` with \`npm install\`...${c0}\n" &&
printf "\n" &&

# Workaround for git:// URLs
if [ -e ~/.gitconfig ]
  then
  cp -i -v ~/.gitconfig ~/.gitconfig_bak
fi
cp -v ./gitconfig ~/.gitconfig &&
printf "\n" &&

cd ./packages/atom-material-ui &&
npm run build && cd ..&&
cd atom-material-syntax-dark &&
npm run build && cd .. && cd .. &&

cd ./dot-atom/packages &&
cd atom-ng-browser &&
npm run build && cd .. &&
cd color-picker &&
npm run build && cd .. &&
cd minimap && npm run build &&
cd .. && cd .. && cd .. &&

printf "\n"
}
case $1 in
	--win-sse4) initWinSSE4; exit 0;;
esac

initMac () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping \`dot-atom/packages\` with \`npm install\`...${c0}\n" &&
printf "\n" &&

# Workaround for git:// URLs
if [ -e ~/.gitconfig ]
  then
  cp -i -v ~/.gitconfig ~/.gitconfig_bak
fi
cp -v ./gitconfig ~/.gitconfig &&
printf "\n" &&

cd ./packages/atom-material-ui &&
npm run build && cd ..&&
cd atom-material-syntax-dark &&
npm run build && cd .. && cd .. &&

cd ./dot-atom/packages &&
cd atom-ng-browser &&
npm run build && cd .. &&
cd color-picker &&
npm run build && cd .. &&
cd minimap && npm run build &&
cd .. && cd .. && cd .. &&

printf "\n" &&
#rm -v ~/.gitconfig &&
printf "\n"
}
case $1 in
	--mac) initMac; exit 0;;
esac

printf "\n" &&
printf "${bold}${GRE}Script to bootstrap \`dot-atom/packages\`${c0}\n" &&
printf "${bold}${YEL}Use the --linux flag for Linux.${c0}\n" &&
printf "${bold}${YEL}Use the --win flag for Windows (in bash)${c0}\n" &&
printf "${bold}${YEL}Use the --mac flag for MacOS (in bash)${c0}\n" &&
printf "${bold}${YEL}Use the --sse4 flag for Linux (SSE4 Version).${c0}\n" &&
printf "${bold}${YEL}Use the --win-sse4 flag for Linux (SSE4 Version).${c0}\n" &&
printf "${bold}${YEL}Use the --help flag to show this help${c0}\n" &&
printf "\n" &&
tput sgr0
