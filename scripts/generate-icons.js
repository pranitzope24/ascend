const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/logo.svg');
const iconsDir = path.join(__dirname, '../public/icons');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512, 1024];

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate favicon-16x16.png
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(iconsDir, 'favicon-16x16.png'));
  // Generate favicon-32x32.png
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon-32x32.png'));
  
  // Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // Generate icon-* sizes
  for (const size of sizes) {
    await sharp(svgBuffer).resize(size, size).png().toFile(path.join(iconsDir, `icon-${size}.png`));
  }
  
  // Generate icon-maskable-512.png
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  // Copy icon-32.png to favicon.ico (most browsers accept PNG as favicon.ico if renamed or we can just leave it as is or use sharp to output raw if it supported it. We'll just copy icon-32.png to favicon.ico for simplicity, or use png-to-ico)
  fs.copyFileSync(path.join(iconsDir, 'favicon-32x32.png'), path.join(iconsDir, 'favicon.ico'));
  fs.copyFileSync(path.join(iconsDir, 'favicon-32x32.png'), path.join(__dirname, '../src/app/favicon.ico'));
  fs.copyFileSync(path.join(iconsDir, 'favicon-32x32.png'), path.join(__dirname, '../public/favicon.ico'));

  console.log('Icons generated successfully.');
}

generate().catch(console.error);
