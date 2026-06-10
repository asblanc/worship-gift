const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const input = path.join(__dirname, '..', 'public', 'img_worship-gift', 'logo-tile.png');
const output = path.join(__dirname, '..', 'public', 'img_worship-gift', 'logo-512.png');

if (!fs.existsSync(input)) {
  console.error('Input not found:', input);
  process.exit(2);
}

sharp(input)
  .resize(512, 512, { fit: 'cover' })
  .toFile(output)
  .then(() => console.log('Created', output))
  .catch(err => {
    console.error('Failed to create logo-512.png:', err);
    process.exit(1);
  });
