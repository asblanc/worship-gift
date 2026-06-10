const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const input = path.join(__dirname, '..', 'public', 'img_worship-gift', 'logo-tile.png');
const output = path.join(__dirname, '..', 'public', 'favicon.ico');

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(2);
}

pngToIco(input)
  .then(buffer => {
    fs.writeFileSync(output, buffer);
    console.log('Created', output);
  })
  .catch(err => {
    console.error('Failed to create favicon.ico:', err);
    process.exit(1);
  });
