import EMOJIS from '../constants/emojis';

export default function getRandomEmoji() {
  return EMOJIS[~~(Math.random() * EMOJIS.length)];
}
