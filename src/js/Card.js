export default class Card {
  constructor(title) {
    this.cardElement = document.createElement('li');
    this.cardElement.className = 'card';
    this.title = title;
  }

  cardFormation() {
    this.cardElement.innerHTML = `<text class="message">${this.title}</text>`;
  }
}
