#!/bin/sh

palette="/tmp/palette.png"

filters="fps=10,scale=320:-1:flags=lanczos"

ffmpeg -v warning -i "$1" -vf "$filters,palettegen=stats_mode=diff" -y $palette

ffmpeg -i "$1" -i "$palette" -lavfi "$filters,paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -y "$1.new.gif"
mv "$1".new.gif "$1"
