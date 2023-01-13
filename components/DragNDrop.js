export default class DragNDrop {
  constructor({
    element,
    startCoords,
    dropZoneSelector,
    onMouseOver,
    onMouseOut,
    onDrop,
  }) {
    this._element = element;
    this._dropZoneSelector = dropZoneSelector;
    this._onMouseOver = onMouseOver;
    this._onMouseOut = onMouseOut;
    this._onDrop = onDrop;

    this._dropZone = null;
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);

    this._initialize(startCoords);
  }

  _initialize({ pageX, pageY }) {
    this._element.style.position = 'absolute';
    this._element.style.zIndex = 1;
    this._element.style.cursor = 'no-drop';

    document.body.append(this._element);
    this._moveTo(pageX, pageY);

    document.addEventListener('pointermove', this._handleMouseMove);
    document.addEventListener('pointerup', this._handleMouseUp);
  }

  _moveTo(pageX, pageY) {
    this._element.style.left = pageX - this._element.offsetWidth / 2 + 'px';
    this._element.style.top = pageY - this._element.offsetHeight / 2 + 'px';
  }

  _handleMouseMove(evt) {
    this._moveTo(evt.pageX, evt.pageY);

    this._element.style.visibility = 'hidden';
    const elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);
    this._element.style.visibility = null;

    if (!elementBelow) return;

    const currentDropZone = elementBelow.closest(this._dropZoneSelector);

    if (!this._dropZone && currentDropZone) {
      this._dropZone = currentDropZone;
      this._handleMouseOver();
    } else if (this._dropZone && !currentDropZone) {
      this._handleMouseOut();
      this._dropZone = null;
    } else if (this._dropZone !== currentDropZone) {
      this._handleMouseOut();
      this._dropZone = currentDropZone;
      this._handleMouseOver();
    }
  }

  _handleMouseUp(evt) {
    document.removeEventListener('pointermove', this._handleMouseMove);
    document.removeEventListener('pointerup', this._handleMouseUp);

    if (this._dropZone) this._handleMouseOut();

    this._element.style.cursor = 'auto';
    this._element.style.position = 'static';

    if (!this._dropZone) {
      this._element.remove();
    } else {
      const [localX, localY] = this._getLocalCoords({
        pageX: evt.pageX,
        pageY: evt.pageY,
      });

      this._onDrop({
        element: this._element,
        zone: this._dropZone,
        coords: { localX, localY },
      });
    }
  }

  _handleMouseOver() {
    this._onMouseOver(this._dropZone);
    this._element.style.cursor = 'pointer';
  }

  _handleMouseOut() {
    this._onMouseOut(this._dropZone);
    this._element.style.cursor = 'no-drop';
  }

  _getLocalCoords({ pageX, pageY }) {
    const {
      width: elementWidth,
      height: elementHeight,
    } = this._element.getBoundingClientRect();

    const {
      x: containerX,
      y: containerY,
      width: containerWidth,
      height: containerHeight,
    } = this._dropZone.getBoundingClientRect();

    let x = pageX - elementWidth / 2 - containerX - window.pageXOffset;

    if (x < 0) {
      x = 0;
    } else if (x > containerWidth - elementWidth) {
      x = containerWidth - elementWidth;
    }

    let y = pageY - elementHeight / 2 - containerY - window.pageYOffset;

    if (y < 0) {
      y = 0;
    } else if (y > containerHeight - elementHeight) {
      y = containerHeight - elementHeight;
    }

    return [x, y];
  }
}
