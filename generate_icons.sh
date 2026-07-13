#!/bin/bash
sizes=(16 32 72 96 128 144 152 192 384 512 1024)

for size in "${sizes[@]}"; do
    sips -z "$size" "$size" public/logo_thumbnail.png --out "public/icons/icon-${size}.png"
done

sips -z 16 16 public/logo_thumbnail.png --out public/icons/favicon-16x16.png
sips -z 32 32 public/logo_thumbnail.png --out public/icons/favicon-32x32.png
sips -z 180 180 public/logo_thumbnail.png --out public/icons/apple-touch-icon.png
sips -z 512 512 public/logo_thumbnail.png --out public/icons/icon-maskable-512.png
