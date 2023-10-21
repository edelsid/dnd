export default class Card {
  constructor(element) {
    this.el = element;
    this.measurements = element.getBoundingClientRect();
  }

  static cardFormation(content) {
    const newCard = document.createElement('li');
    newCard.className = 'card';
    newCard.innerHTML = `<text class="message">${content}</text>`;
    return newCard;
  }

  createProjection() {
    const projection = document.createElement('li');
    projection.className = 'projection';
    projection.style.width = `${this.measurements.width}px`;
    projection.style.height = `${this.measurements.height}px`;
    return projection;
  }
}
