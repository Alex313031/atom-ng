## Atom-ng Changelog

## Atom before 1.66
For Atom releases from upstream Atom, see > https://web.archive.org/web/20221210014824/https://atom.io/releases

## Atom-ng

### 1.66.9
 - Updated Electron to use my custom compiler optimized builds! See [here](https://github.com/Alex313031/electron-12.2.3)
 - Updated apm-ng to 2.6.9, taking patches from Atom-Community > https://github.com/Alex313031/apm-ng/commit/6e0cd14d19e6c02140112b7bb3bddf3147a0eba3
 - Updated [tree-view](https://github.com/Alex313031/tree-view-ng) to include an "Open File" button and use an [Octocat image](https://github.com/Alex313031/tree-view-ng/blob/master/assets/Floating_Octocat.svg) instead of the Telescope image as the background.
 - Updated [background-tips](https://github.com/Alex313031/background-tips-ng)
 - Added [atom-ng-browser](https://github.com/Alex313031/atom-ng-browser) package, which allows rendering local files and searching the web, as well as rendering internal stuff like `chrome://gpu`!
 - Added Windows 7 Support for `apm`
 - Fixed apm installer name for Windows
 - Changed .exe author name
 - Minor subdeps updates for modules
 - Added [portable runner scripts](https://github.com/Alex313031/atom-ng/tree/master/portable) and readme to the installers and .zips (and made atom-ng search for a `.atom` folder alongside it, rather than a directory above, which never made sense.
 - Made forks of [electron-chromedriver](https://github.com/Alex313031/chromedriver-ng), [electron-mksnapshot](https://github.com/Alex313031/mksnapshot-ng), [electron-link](https://github.com/Alex313031/electron-link-ng) and [electron-packager](https://github.com/Alex313031/electron-packager-ng) to support caching electron downloads in './electron', and to facilitate my custom binaries.
 - Fixed package ID for Mac and Windows installer: com.github.atom >> com.alex313031.atom
 - Enabled GPU rasterization, VAAPI, and QUIC
 - New command line flag `--fps` which will append --show-fps-counter to electron and show a developer heads up display showing FPS and GPU Mem usage of all overlays
 - Enabled ui-devtools to allow inspection of ALL layers in atom-ng, including native views
 - More little tweaks and fixes here and there

*NOTE*: Because of the Compiler optimizations which include `-O3, -mavx, and -maes,` this release will *not* run on a CPU older than Intel 2nd Gen (Sandy Bridge) or AMD FX (Bulldozer). Your CPU must support [AVX](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX)

### 1.66.8
 - Never released publicly

### 1.66.7
 - First stable version
 - Added linter, minimap, and color-picker packages
 - Minor deps updates
 - Fixed Windows installer

### 1.66.6
 - Never released publicly

### 1.66.5-dev
 - Updated superstring package
 - Updated welcome package and about package
 - Completely removed reporting
 - Replaced more atom strings throughout the UI with atom-ng
 -  Added some more custom branding/images
 - Fixed links throughout the repo to either point to web.archive.org versions of atom.io's pages, or to this repo rather than upstream atom's

TODO:
– Add some more preinstalled packages like simple-browser and atom-colors
– Fix naming of Windows zips generated by build.bat, and fix making installers without atom.io's squirrel .jsons

### 1.66.4-dev
| I'm keepin' atom alive!

 - Updated many dependencies for atom-ng and the build scripts, and build.bat for Windows
 - Updated electron-linker to 12.2.3
 - Updated all atom language-* packages to latest versions
 - Updated [apm-ng](https://github.com/Alex313031/apm-ng) (my fork of apm) to 2.6.8 as well as its dependencies
 - Updated find-and-replace and snippets packages to forks I made of [atom-community's](https://github.com/atom-community) versions, which are themselves also more up to date
 - Updated git-diff package
 - Added stripping to linker flags

TODO: 
 &ndash; Replace more atom strings throughout the UI with atom-ng
 &ndash; Add some more custom branding, like images
 &ndash; Add some more preinstalled packages like simple-browser and atom-colors
 &ndash; Fix naming of Windows zips generated by build.bat, and fix making installers without atom.io's squirrel .jsons
 &ndash; Fix links throughout the repo to either point to web.archive.org versions of atom.io's pages, or to this repo rather than upstream atom's

### 1.66.3-dev
__- UPDATED Electron to 12.2.3!__
 - Updated debian packaging scripts and .desktop file
 - Updated various package.jsons
 - Updated branding, about page and welcome page
 - Removed telemetry, and crashreporter.
 - Appended no-sandbox and ignore-gpu-blocklist
 - Added new Canvas2D API

### 1.66.2-dev
 - Never released publicly

### 1.66.1-dev
 - Never released publicly

### 1.66.0-dev
 - Never released publicly

### 1.65.4-dev
 - Never released publicly

### 1.65.3-dev
 - Never released publicly

### 1.65.2-dev
 - Updated installer scripts
 - Updated various package.jsons
 - Updated apm
 - Removed deprecation notice on first start

### 1.65.1-dev
 - Never released publicly

### 1.65.0-dev
 - More optimization flags
 - Updated npm deps to latest versions
 - Based on last atom commit
 - Updated icons and branding

Includes .deb and .tar.gz for Linux, and a .zip for Windows.

### 1.63.1 - 1.64.0-dev
 - Never released publicly
 - Was upstream Atom only

### 1.63.0-dev
First test release of *Atom-ng* for Linux.

For the tar.gz: unpack, and run `RUN.sh`
