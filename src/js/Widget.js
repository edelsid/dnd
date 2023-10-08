import Card from './Card';
import Form from './Form';
import image from '../img/image.png';

const picture = document.querySelector('.attachment_img');
picture.src = image;

export default class Widget {
  constructor(element) {
    if (typeof element === 'string') {
      // eslint-disable-next-line no-param-reassign
      element = document.querySelector(element);
    }
    this.element = element;

    this.buttons = document.querySelectorAll('.add_card');
    this.panels = document.querySelectorAll('.cards');

    this.onClick = this.onClick.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);

    this.buttons.forEach((el) => {
      el.addEventListener('click', this.onClick);
    });
  }

  loadState() {
    if (localStorage.length !== 0) {
      const toDo = JSON.parse(localStorage.getItem('panel TODO'));
      const inProgress = JSON.parse(localStorage.getItem('panel IN PROGRESS'));
      const done = JSON.parse(localStorage.getItem('panel DONE'));
      const cardArr = [];
      cardArr.push(toDo, inProgress, done);

      for (let i = 0; i < this.panels.length; i += 1) {
        this.panels[i].innerHTML = '';
        Object.keys(cardArr[i]).forEach((key) => {
          const newCard = document.createElement('div');
          newCard.className = 'card';
          newCard.innerHTML = cardArr[i][key];
          this.panels[i].insertAdjacentElement('beforeend', newCard);
        });
      }
    }
  }

  init() {
    const cards = document.querySelectorAll('.card');

    const deletion = Array.from(document.querySelectorAll('.delete'));
    deletion.forEach((el) => {
      el.parentElement.removeChild(el);
    });

    cards.forEach((el) => {
      el.addEventListener('mouseenter', this.onEnter);
      el.addEventListener('mouseleave', Widget.onLeave);
      el.addEventListener('mousedown', this.onMouseDown);
    });
  }

  onEnter(e) {
    const deletion = document.createElement('span');
    const target = e.target.querySelector('.message');
    target.appendChild(deletion);
    deletion.classList.add('delete');
    deletion.addEventListener('click', this.onClick);
  }

  static onLeave(e) {
    const target = e.target.querySelector('.message');
    if (target.firstElementChild && target.firstElementChild.classList.contains('delete')) {
      target.removeChild(target.firstElementChild);
    }
  }

  onClick(e) {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
      this.saveState();
    } else if (e.target.classList.contains('add_card')) {
      this.formAdd(e.target.parentNode);
    } else if (e.target.classList.contains('card_discard')) {
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    } else if (e.target.classList.contains('card_confirm')) {
      this.cardAdd(e.target);
      this.saveState();
    }
  }

  static emptySpace(node, panel, target) {
    if (node !== target) {
      const makeSpace = () => {
        const empty = panel.querySelector('.empty');
        if (empty === null) {
          const space = document.createElement('li');
          space.className = 'empty';
          space.style.height = `${target.offsetHeight}px`;
          panel.insertBefore(space, node);

          const deleteSpace = () => {
            const spaceToDelete = document.querySelector('.empty');
            spaceToDelete.parentNode.removeChild(spaceToDelete);
            node.removeEventListener('mouseenter', makeSpace);
          };
          space.addEventListener('mouseleave', deleteSpace);
        }
      };

      node.addEventListener('mouseenter', makeSpace);
    }
  }

  // eslint-disable-next-line consistent-return
  onMouseDown(event) {
    if (event.button === 0) {
      event.preventDefault();
      if (event.target.classList.contains('delete')) {
        this.onClick(event);
        return false;
      }
      const target = event.currentTarget;

      target.style.width = `${target.offsetWidth}px`;
      target.style.height = `${target.offsetHeight}px`;
      target.classList.add('grab');

      let mouseUpItem;
      let panel;

      const onMouseOver = (e) => {
        target.style.left = `${e.pageX - target.offsetWidth / 2}px`;
        target.style.top = `${e.pageY - target.offsetHeight / 2}px`;

        this.panels.forEach((area) => {
          const panelCoord = area.getBoundingClientRect();
          if (panelCoord.left < e.pageX && panelCoord.right > e.pageX) {
            panel = area;
            const nodes = Array.from(area.children);
            nodes.forEach((node) => {
              const coord = node.getBoundingClientRect();
              // eslint-disable-next-line max-len
              if (coord.left < e.pageX && coord.right > e.pageX && coord.top < e.pageY && coord.bottom > e.pageY) {
                mouseUpItem = node;
                Widget.emptySpace(mouseUpItem, panel, target);
              }
            });
          }
        });
      };

      const onMouseUp = () => {
        panel.insertBefore(target, mouseUpItem);
        target.classList.remove('grab');
        document.documentElement.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseover', onMouseOver);
        this.saveState();
      };

      document.documentElement.addEventListener('mouseover', onMouseOver);
      this.panels.forEach((el) => {
        el.addEventListener('mouseup', onMouseUp);
      });
    }
  }

  saveState() {
    localStorage.clear();
    this.panels.forEach((el) => {
      const nodes = {};
      const cards = Array.from(el.children);
      for (let i = 0; i < cards.length; i += 1) {
        nodes[`key${i}`] = cards[i].innerHTML;
      }
      localStorage.setItem(`panel ${el.parentElement.firstElementChild.innerText}`, JSON.stringify(nodes));
    });
  }

  cardAdd(el) {
    const newCard = new Card(el.parentNode.firstElementChild.value);
    const panel = el.parentNode.parentNode.parentNode;
    const cardArea = panel.querySelector('.cards');
    newCard.cardFormation();
    cardArea.appendChild(newCard.cardElement);
    panel.removeChild(el.parentNode.parentNode);
    this.init();
  }

  formAdd(el) {
    const newForm = new Form();
    newForm.formFormation();
    el.appendChild(newForm.formElement);

    const discard = el.querySelector('.card_discard');
    const add = el.querySelector('.card_confirm');
    discard.addEventListener('click', this.onClick);
    add.addEventListener('click', this.onClick);
  }
}
