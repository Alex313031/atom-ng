@echo off

title Cleaning Atom-ng Artifacts & Node Modules

echo Cleaning Atom-ng...

rimraf -v .\docs\output
rimraf -v .\dot-atom\packages\atom-ng-browser\node_modules
rimraf -v .\dot-atom\packages\minimap\node_modules
rimraf -v .\dot-atom\packages\minimap\.parcel-cache
rimraf -v .\dot-atom\packages\minimap\dist
npm run clean
