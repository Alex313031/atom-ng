@echo off

title Bootstrapping dot-atom Packages

echo Bootstrapping `dot-atom/packages` with `npm install`...

set CFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CXXFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set CPPFLAGS=-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type
set LDFLAGS=-Wl,-O3 -mavx -maes -s
set VERBOSE=1
set V=1

set MSVS_VERSION=2017
set GYP_MSVS_VERSION=2017

set ELECTRON_CACHE=%~dp0%electron\bin
set electron_config_cache=%~dp0%electron\bin

cd .\packages\atom-material-ui&&npm run build&&cd ..&&cd atom-material-syntax-dark&&npm run build&&cd ..&&cd ..&&cd .\dot-atom\packages&&cd atom-ng-browser&&npm run build&&cd ..&&cd color-picker&&npm run build&&cd ..&&cd minimap&&npm run build&&cd ..&&cd ..&&cd ..
