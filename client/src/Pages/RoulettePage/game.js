export class Game {
  #numbers;
  blackNumbers;

  constructor() {
    this.#numbers = Array.from({ length: 37 }, (_, i) => i);
    this.blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    console.log(this.#numbers);
  }

  // function startGame() {

  // }

  getResult() {
    const randomIndex = Math.floor(Math.random() * this.#numbers.length);
    const randomNumber = this.#numbers[randomIndex];
    return randomNumber;
  }
}