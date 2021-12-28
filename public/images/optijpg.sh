#!/usr/bin/env sh

ffmpeg -i "$1" -vf "scale=-1:1080" -q 2 -y "$1"
