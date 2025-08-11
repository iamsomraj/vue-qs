#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }
  readonly husky_skip_init=1
  export husky_skip_init
  debug "starting $0..."
  readonly hook_name="$(basename -- "$0")"
  debug "git command: $(command -v git)"
  if [ "${CI:-}" = "true" ]; then
    debug "CI detected, skipping Git hooks installation"
    exit 0
  fi
fi
