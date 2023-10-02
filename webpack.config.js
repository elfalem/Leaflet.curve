
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const path = require('path');

module.exports = {
  entry: './src/leaflet.curve.js',
  output: {
    filename: 'leaflet.curve.js',
    path: path.resolve(__dirname, 'dist')
  }
};
