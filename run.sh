#!/bin/bash

set -e

cd ./out/Atom-ng_1.66.13_amd64/ &&
ATOM_HOME="${PWD}/.atom" ./atom-ng $@
