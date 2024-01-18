@echo off

title Building Atom-ng

echo Building Atom-ng for Windows...

set CFLAGS=-DNDEBUG /O2 /arch:AVX -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CXXFLAGS=-DNDEBUG /O2 /arch:AVX -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CPPFLAGS=-DNDEBUG /O2 /arch:AVX -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set LDFLAGS=-Wl,-O3 -mavx -maes -s

mkdir %USERPROFILE%\.atom\.node-gyp
copy gitconfig %USERPROFILE%\.atom\.node-gyp\.gitconfig

set MSVS_VERSION=2019
set GYP_MSVS_VERSION=2019

set ELECTRON_CACHE=%~dp0%electron\bin
set electron_config_cache=%~dp0%electron\bin

set NODE_ENV=production

script\build.cmd --compress-artifacts --create-windows-installer
