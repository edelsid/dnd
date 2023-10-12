import Card from './Card';
import Form from './Form';
import image from '../img/image.png';

const picture = document.querySelector('.attachment_img');
picture.src = image;

export default class Widget {
  constructor(element) {
    this.element = element;
    this.draggedEl = null;
    this.draggedProjection = null;
    this.cardAreas = document.querySelectorAll('.cards');

    this.onClick = this.onClick.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  init() {
    if (localStorage.length !== 0) {
      const toDo = JSON.parse(localStorage.getItem('panel TODO'));
      const inProgress = JSON.parse(localStorage.getItem('panel IN PROGRESS'));
      const done = JSON.parse(localStorage.getItem('panel DONE'));
      const cardArr = [];
      cardArr.push(toDo, inProgress, done);

      for (let i = 0; i < this.cardAreas.length; i += 1) {
        this.cardAreas[i].innerHTML = '';
        Object.keys(cardArr[i]).forEach((key) => {
          const newCard = document.createElement('div');
          newCard.className = 'card';
          newCard.innerHTML = cardArr[i][key];
          this.cardAreas[i].insertAdjacentElement('beforeend', newCard);
        });
      }
    }
  }

  onEnter(e) {
    if (e.target.className === 'card') {
      const deletion = document.createElement('span');
      const target = e.target.querySelector('.message');
      target.appendChild(deletion);
      deletion.classList.add('delete');
      deletion.addEventListener('click', this.onClick);
      e.target.addEventListener('mouseleave', Widget.onLeave);
    }
  }

  static onLeave() {
    const target = document.querySelector('.delete');
    target.remove();
  }

  onMouseDown = (e) => {
    let target;
    if (e.target.className === 'card') {
      target = e.target;
    } else if (e.target.className === 'message'
      || e.target.className === 'icons'
      || e.target.className === 'labels'
      || e.target.className === 'avatars'
      || e.target.className === 'attachment_img') {
      target = e.target.closest('.card');
    }
    if (e.button === 0 && target) {
      e.preventDefault();
      this.shiftX = e.pageX - target.getBoundingClientRect().left;
      this.shiftY = e.pageY - target.getBoundingClientRect().top + 10;
      this.setDraggable(target);
      this.draggedEl.el.style.left = `${e.pageX - this.shiftX}px`;
      this.draggedEl.el.style.top = `${e.pageY - this.shiftY}px`;
      document.body.style.cursor = 'grabbing';
      this.projection(e);
    }
  };

  onMouseMove = (e) => {
    if (this.draggedEl) {
      const element = this.draggedEl;
      element.el.style.width = `${this.draggedEl.measurements.width}px`;
      element.el.style.height = `${this.draggedEl.measurements.height - 10}px`;
      element.el.style.left = `${e.pageX - this.shiftX}px`;
      element.el.style.top = `${e.pageY - this.shiftY}px`;
      element.el.classList.add('grab');
      document.body.style.cursor = 'grabbing';
      element.el.style.pointerEvents = 'none';

      this.projection(e);
    }
  };

  projection(e) {
    const { target } = e;
    const dragged = this.draggedEl;
    const projection = this.draggedProjection;
    if (target.classList.contains('card')
   && !target.classList.contains('projection')) {
      const { y, height } = target.getBoundingClientRect();
      const counting = y + height / 2;
      const position = counting > e.clientY ? 'beforebegin' : 'afterend';

      if (!projection) {
        this.draggedProjection = dragged.createProjection();
      } else {
        projection.remove();
        target.insertAdjacentElement(position, projection);
      }
    }
  }

  replace() {
    if (this.draggedProjection) {
      this.draggedProjection.replaceWith(this.draggedEl.el);
    }
  }

  onMouseUp = () => {
    if (this.draggedEl) {
      this.draggedEl.el.removeAttribute('style');
      document.body.style.cursor = '';
      this.replace();
      this.draggedEl.el.classList.remove('grab');
      this.draggedEl = null;
      this.draggedProjection = null;
      this.saveState();
    }
  };

  onClick(e) {
    if (e.target.classList.contains('card_title')) {
      return false;
    }
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
      e.target.parentNode.parentNode.remove();
      this.saveState();
    } else if (e.target.classList.contains('add_card')) {
      Widget.formAdd(e.target.parentNode);
    } else if (e.target.classList.contains('card_discard')) {
      e.target.parentNode.parentNode.remove();
    } else if (e.target.classList.contains('card_confirm')) {
      Widget.cardAdd(e.target);
      this.saveState();
    }
    return false;
  }

  setDraggable(node) {
    this.draggedEl = new Card(node);
  }

  saveState() {
    localStorage.clear();
    this.cardAreas.forEach((el) => {
      const nodes = {};
      const cards = Array.from(el.children);
      for (let i = 0; i < cards.length; i += 1) {
        nodes[`key${i}`] = cards[i].innerHTML;
      }
      localStorage.setItem(`panel ${el.parentElement.firstElementChild.innerText}`, JSON.stringify(nodes));
    });
  }

  static formAdd(el) {
    const newForm = new Form();
    newForm.formFormation();
    el.appendChild(newForm.formElement);
  }

  static cardAdd(el) {
    const panel = el.parentNode.parentNode.parentNode;
    const cardArea = panel.querySelector('.cards');
    cardArea.appendChild(Card.cardFormation(el.parentNode.firstElementChild.value));
    el.parentNode.parentNode.remove();
  }
}
