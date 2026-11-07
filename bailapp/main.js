import { renderShotAt, setPrecomputedSign } from './shots.js';
import * as B from './engine/bulbs.js';

const cv = document.getElementById('c');
const g = cv.getContext('2d', { willReadFrequently: true });

// Load fonts
try {
  await Promise.all([
    '80px Limelight',
    '80px Poiret',
    '600 40px Josefin',
    '400 40px Josefin',
    '700 40px Josefin',
    '80px Italiana'
  ].map(f => document.fonts.load(f)));
} catch (e) {
  console.warn('Font load warning:', e);
}

// Precompute sign once during initialization so render(t) is blazing fast
try {
  const sign = B.buildSign('BAILAPP', { size: 140, spacing: 14 });
  setPrecomputedSign(sign);
} catch (e) {
  console.warn('Sign build warning:', e);
}

window.DUR = 30.0;

window.render = async t => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
  g.clearRect(0, 0, 1080, 1920);

  renderShotAt(g, t);
};

window.READY = true;
