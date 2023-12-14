export default class Controller {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;

  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    this.#addEventListener();
  }

  #addEventListener() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
        case 'ArrowUp':
          this.forward = true;
          break;
      }
    };
    document.onkeyup = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
        case 'ArrowUp':
          this.forward = false;
          break;
      }
    };
  }
}
