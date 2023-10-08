export default class Form {
  constructor() {
    this.formElement = document.createElement('div');
    this.formElement.className = 'input_form';
  }

  formFormation() {
    this.formElement.innerHTML = `
      <div class="form_group">
         <textarea class="card_title" placeholder="Enter a title for this card..."></textarea>
         <button class="card_confirm">Add Card</button>
         <span class="card_discard"></span>
      </div>`;
  }
}
