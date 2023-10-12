import Widget from './Widget';

const widg1 = new Widget('.widget');

widg1.init();

document.body.addEventListener('mouseenter', widg1.onEnter, true);
document.body.addEventListener('mousedown', widg1.onMouseDown, true);
document.body.addEventListener('click', widg1.onClick);
document.body.addEventListener('mousemove', widg1.onMouseMove);
document.body.addEventListener('mouseup', widg1.onMouseUp);
