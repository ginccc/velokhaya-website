// Generates the default social-preview image (src/assets/images/og-default.jpg, 1200x630):
// the hero photo cropped so the riders' heads stay in frame, a dark gradient, and the logo.
// The logo is centred at the bottom so it survives the narrower crops chat apps apply
// (WhatsApp ~3:2, some apps 1:1). Run with: npm run og-image
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const CROP_TOP = 60; // px from the top of the 1200x1200 resize; keeps helmets fully visible
const LOGO_WIDTH = 360;
const LOGO_BOTTOM_MARGIN = 44;

const photo = await sharp('src/assets/images/hero-riders.jpg')
  .resize(WIDTH, WIDTH)
  .extract({ left: 0, top: CROP_TOP, width: WIDTH, height: HEIGHT })
  .toBuffer();

const gradient = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0.45" stop-color="#000" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="#000" stop-opacity="0.85"/>` +
    `</linearGradient></defs><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/></svg>`,
);

const logo = await sharp('public/images/logo.png').resize({ width: LOGO_WIDTH }).toBuffer();
const { height: logoHeight } = await sharp(logo).metadata();

await sharp(photo)
  .composite([
    { input: gradient },
    { input: logo, left: Math.round((WIDTH - LOGO_WIDTH) / 2), top: HEIGHT - logoHeight - LOGO_BOTTOM_MARGIN },
  ])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('src/assets/images/og-default.jpg');

console.log('Wrote src/assets/images/og-default.jpg');
