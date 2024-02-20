@echo off

title Building Atom-ng

echo Building Atom-ng for Windows (SSE4 Version)...

set CFLAGS=-DNDEBUG /O2 -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CXXFLAGS=-DNDEBUG /O2 -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CPPFLAGS=-DNDEBUG /O2 -msse3 -mssse3 -msse4.1 -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set LDFLAGS=-Wl,-O3 -msse3 -mssse3 -msse4.1 -s

mkdir %USERPROFILE%\.atom\.node-gyp
copy gitconfig %USERPROFILE%\.atom\.node-gyp\.gitconfig

set MSVS_VERSION=2019
set GYP_MSVS_VERSION=2019

set ELECTRON_CACHE=%~dp0%electron\bin
set electron_config_cache=%~dp0%electron\bin

set NODE_ENV=production

script\build.cmd --compress-artifacts --create-windows-installer
