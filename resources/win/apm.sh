#!/bin/sh

export NODE_SKIP_PLATFORM_CHECK=1

"$(dirname "$0")/../app/apm/bin/apm" "$@"
