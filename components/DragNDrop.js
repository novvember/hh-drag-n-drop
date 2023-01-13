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

    this._currentDropZone = null;
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

    document.addEventListener('mousemove', this._handleMouseMove);
    this._element.addEventListener('mouseup', this._handleMouseUp);
  }

  _moveTo(pageX, pageY) {
    this._element.style.left = pageX - this._element.offsetWidth / 2 + 'px';
    this._element.style.top = pageY - this._element.offsetHeight / 2 + 'px';
  }

  _handleMouseMove(evt) {
    this._moveTo(evt.pageX, evt.pageY);

    this._element.style.visibility = 'hidden';
    const elementBelow = document.elementFromPoint(evt.pageX, evt.pageY);
    this._element.style.visibility = null;

    if (!elementBelow) return;

    const newZone = elementBelow.closest(this._dropZoneSelector);

    if (!this._currentDropZone && newZone) {
      this._currentDropZone = newZone;
      this._handleMouseOver();
    } else if (this._currentDropZone && !newZone) {
      this._handleMouseOut();
      this._currentDropZone = null;
    } else if (this._currentDropZone !== newZone) {
      this._handleMouseOut();
      this._currentDropZone = newZone;
      this._handleMouseOver();
    }
  }

  _handleMouseUp(evt) {
    document.removeEventListener('mousemove', this._handleMouseMove);
    this._element.removeEventListener('mouseup', this._handleMouseUp);
    if (this._currentDropZone) this._handleMouseOut();
    this._element.style.cursor = 'auto';

    if (!this._currentDropZone) {
      this._element.remove();
    }
  }

  _handleMouseOver() {
    this._onMouseOver(this._currentDropZone);
    this._element.style.cursor = 'pointer';
  }

  _handleMouseOut() {
    this._onMouseOut(this._currentDropZone);
    this._element.style.cursor = 'no-drop';
  }
}
