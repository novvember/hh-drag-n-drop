import EMOJIS from '../constants/emojis.js';

export default function getRandomEmoji() {
  return EMOJIS[~~(Math.random() * EMOJIS.length)];
}
