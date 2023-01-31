import DragNDrop from '../components/DragNDrop.js';
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

function focusZone(zone) {
  zone.classList.add(ACTIVE_ZONE_CLASS);
}

function unfocusZone(zone) {
  zone.classList.remove(ACTIVE_ZONE_CLASS);
}

function addElementToGridZone(element) {
  gridDropZone.append(element);
}

function addElementToFreeZone(element, { localX, localY }) {
  const zone = freeDropZone;

  element.style.position = 'absolute';
  element.style.left = localX + 'px';
  element.style.top = localY + 'px';

  zone.append(element);
}

function handleDrop({ element, zone, coords }) {
  if (zone === gridDropZone) {
    addElementToGridZone(element);
  } else if (zone === freeDropZone) {
    addElementToFreeZone(element, coords);
  } else {
    element.remove();
  }
}

function handleSpawnZoneMouseDown(evt) {
  const box = createNewBox();

  const dragNDrop = new DragNDrop({
    element: box,
    startCoords: { pageX: evt.pageX, pageY: evt.pageY },
    dropZoneSelector: DROP_ZONE_SELECTOR,
    onMouseOver: focusZone,
    onMouseOut: unfocusZone,
    onDrop: handleDrop,
  });
}

spawnZone.addEventListener('pointerdown', handleSpawnZoneMouseDown);
