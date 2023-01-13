import getRandomEmoji from '../utils/getRandomEmoji.js';

const spawnZone = document.querySelector('.zone_type_spawn');
const gridDropZone = document.querySelector('.zone_type_drop-grid');
const freeDropZone = document.querySelector('.zone_type_drop-free');

const BOX_TEMPLATE_SELECTOR = '.box-template';
const BOX_SELECTOR = '.box';

function createNewBox() {
  const box = document
    .querySelector(BOX_TEMPLATE_SELECTOR)
    .content.querySelector(BOX_SELECTOR)
    .cloneNode(true);

  const emoji = getRandomEmoji();
  box.textContent = emoji;

  return box;
}

function handleSpawnZoneMouseDown(evt) {
  function moveBoxTo(box, pageX, pageY) {
    box.style.left = pageX - box.offsetWidth / 2 + 'px';
    box.style.top = pageY - box.offsetHeight / 2 + 'px';
  }

  function handleMouseMove(evt) {
    moveBoxTo(box, evt.pageX, evt.pageY);
  }

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    box.removeEventListener('mouseup', handleMouseUp);
  }

  const box = createNewBox();
  box.style.position = 'absolute';
  box.style.zIndex = 1;

  document.body.append(box);
  moveBoxTo(box, evt.pageX, evt.pageY);

  document.addEventListener('mousemove', handleMouseMove);
  box.addEventListener('mouseup', handleMouseUp);
}

spawnZone.addEventListener('mousedown', handleSpawnZoneMouseDown);
