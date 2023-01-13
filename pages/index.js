import getRandomEmoji from '../utils/getRandomEmoji.js';

const spawnZone = document.querySelector('.zone_type_spawn');
const gridDropZone = document.querySelector('.zone_type_drop-grid');
const freeDropZone = document.querySelector('.zone_type_drop-free');

const BOX_TEMPLATE_SELECTOR = '.box-template';
const BOX_SELECTOR = '.box';
const DROP_ZONE_SELECTOR = '.zone_type_drop';
const ACTIVE_ZONE_CLASS = 'zone_type_drop_active';

function createNewBox() {
  const box = document
    .querySelector(BOX_TEMPLATE_SELECTOR)
    .content.querySelector(BOX_SELECTOR)
    .cloneNode(true);

  const emoji = getRandomEmoji();
  box.textContent = emoji;

  return box;
}

function focusZone(element) {
  element.classList.add(ACTIVE_ZONE_CLASS);
}

function unfocusZone(element) {
  element.classList.remove(ACTIVE_ZONE_CLASS);
}

function handleSpawnZoneMouseDown(evt) {
  function moveBoxTo(pageX, pageY) {
    box.style.left = pageX - box.offsetWidth / 2 + 'px';
    box.style.top = pageY - box.offsetHeight / 2 + 'px';
  }

  function handleMouseMove(evt) {
    moveBoxTo(evt.pageX, evt.pageY);

    box.style.visibility = 'hidden';
    const elementBelow = document.elementFromPoint(evt.pageX, evt.pageY);
    box.style.visibility = null;

    if (!elementBelow) return;

    const newZone = elementBelow.closest(DROP_ZONE_SELECTOR);

    if (!currentZone && newZone) {
      currentZone = newZone;
      focusZone(currentZone);
    } else if (currentZone && !newZone) {
      unfocusZone(currentZone);
      currentZone = null;
    } else if (currentZone !== newZone) {
      unfocusZone(currentZone);
      currentZone = newZone;
      focusZone(currentZone);
    }
  }

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    box.removeEventListener('mouseup', handleMouseUp);
  }

  const box = createNewBox();
  box.style.position = 'absolute';
  box.style.zIndex = 1;

  document.body.append(box);
  moveBoxTo(evt.pageX, evt.pageY);

  let currentZone = null;

  document.addEventListener('mousemove', handleMouseMove);
  box.addEventListener('mouseup', handleMouseUp);
}

spawnZone.addEventListener('mousedown', handleSpawnZoneMouseDown);
