# Atom-ng &nbsp;<img src="https://raw.githubusercontent.com/Alex313031/atom-ng/master/resources/app-icons/dev/png/512.png" width="48">

![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/alex313031/atom-ng?label=Version%3A) &nbsp;![GitHub](https://img.shields.io/github/license/alex313031/atom-ng?color=green&label=License%3A) &nbsp;![GitHub commit activity](https://img.shields.io/github/commit-activity/w/alex313031/atom-ng?color=blueviolet&label=Commit%20Activity%3A)

Atom-ng is a hackable text editor for the 21st century, built on [Electron](https://github.com/electron/electron), and based on everything we love about our favorite editors. We designed it to be deeply customizable, but still approachable using the default configuration.

![Atom](https://user-images.githubusercontent.com/378023/49132477-f4b77680-f31f-11e8-8357-ac6491761c6c.png)

![Atom Screenshot](https://user-images.githubusercontent.com/378023/49132478-f4b77680-f31f-11e8-9e10-e8454d8d9b7e.png)

Visit https://thorium.rocks/atom-ng/ to learn more or visit the [Atom-ng forum](https://github.com/Alex313031/atom-ng/discussions).

Follow [@AtomEditor](https://twitter.com/atomeditor) on Twitter for important
announcements.

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior to [Alex313031@gmail.com](mailto:Alex313031@gmail.com).

## Documentation

If you want to read about using Atom-ng or developing packages in Atom-ng, the [Atom Flight Manual](https://flight-manual-atom-io.github.io) is free and available online. You can find the source to the manual in [atom/flight-manual-atom-io.github.io](https://github.com/atom/flight-manual-atom-io.github.io).

The [API reference](https://web.archive.org/web/20221201134904/https://atom.io/docs/api) for developing packages is also documented on Atom.io.

## Installing

### Prerequisites
- [Git](https://git-scm.com)

### macOS

Download the latest [Atom-ng release](https://github.com/Alex313031/atom-ng/releases/latest).

Atom-ng will automatically update when a new release is available.

### Windows

Download the latest [Atom installer](https://github.com/Alex313031/atom-ng/releases/latest). `AtomSetup.exe` is 32-bit. For 64-bit systems, download `AtomSetup-x64.exe`.

Atom-ng will automatically update when a new release is available.

You can also download `atom-ng-windows.zip` (32-bit) or `atom-ng-x64-windows.zip` (64-bit) from the [releases page](https://github.com/Alex313031/atom-ng/releases/latest).
The `.zip` version will not automatically update.

Using [Chocolatey](https://chocolatey.org)? Run `cinst Atom` to install the latest version of Atom.

### Linux

Atom-ng is only available for 64-bit Linux systems.

Configure your distribution's package manager to install and update Atom-ng by following the [Linux installation instructions](https://flight-manual-atom-io.github.io/getting-started/sections/installing-atom/#platform-linux) in the Flight Manual.  You will also find instructions on how to install Atom-ng's official Linux packages without using a package repository, though you will not get automatic updates after installing Atom-ng this way.

#### Archive extraction

An archive is available for people who don't want to install `atom-ng` as root.

This version enables you to install multiple Atom-ng versions in parallel. It has been built on Ubuntu 64-bit,
but should be compatible with other Linux distributions.

1. Install dependencies (on Ubuntu):
```sh
sudo apt install git libasound2 libcurl4 libgbm1 libgcrypt20 libgtk-3-0 libnotify4 libnss3 libglib2.0-bin xdg-utils libx11-xcb1 libxcb-dri3-0 libxss1 libxtst6 libxkbfile1
```
2. Download `atom-ng-amd64.tar.gz` from the [Atom-ng releases page](https://github.com/Alex313031/atom-ng/releases/latest).
3. Run `tar xf atom-ng-amd64.tar.gz` in the directory where you want to extract the Atom-ng folder.
4. Launch Atom-ng using the installed `atom-ng` command from the newly extracted directory.

The Linux version does not currently automatically update so you will need to
repeat these steps to upgrade to future releases.

## Building

* [Linux](https://flight-manual-atom-io.github.io/hacking-atom/sections/hacking-on-atom-core/#platform-linux)
* [macOS](https://flight-manual-atom-io.github.io/hacking-atom/sections/hacking-on-atom-core/#platform-mac)
* [Windows](https://flight-manual-atom-io.github.io/hacking-atom/sections/hacking-on-atom-core/#platform-windows)

## Discussion

* Discuss Atom-ng on [GitHub Discussions](https://github.com/Alex313031/atom-ng/discussions)

## License

[MIT](https://github.com/Alex313031/atom-ng/blob/master/LICENSE.md)

When using the Atom or other GitHub logos, be sure to follow the [GitHub logo guidelines](https://github.com/logos).
