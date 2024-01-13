#!/bin/bash

set -e

cd ./out/Atom-ng_1.66.11_amd64/ &&
ATOM_HOME="${PWD}/.atom" ./atom-ng $@
