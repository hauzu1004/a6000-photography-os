#!/usr/bin/env bash
cd "$(dirname "$0")"
exec npx serve . -l 3001
