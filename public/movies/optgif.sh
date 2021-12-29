#!/bin/sh

filename="$1"
mid="${filename%.*}"
ffmpeg -i "$mid.gif" -c vp9 -b:v 0 -crf 41 "$mid.webm"
