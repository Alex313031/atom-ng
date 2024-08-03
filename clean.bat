@echo off

title Cleaning Atom-ng Artifacts and Node Modules

echo Cleaning Atom-ng...

rd /q /s .\docs\output
rd /q /s .\dot-atom\packages\atom-ng-browser\node_modules
rd /q /s .\dot-atom\packages\minimap\node_modules
rd /q /s .\dot-atom\packages\minimap\.parcel-cache
rd /q /s .\dot-atom\packages\minimap\dist
npm run clean
