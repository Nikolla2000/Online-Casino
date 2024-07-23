export class Game {
  #numbers;
  blackNumbers;

  constructor() {
    this.#numbers = Array.from({ length: 37 }, (_, i) => i);
    this.blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  }

  getResult() {
    const randomIndex = Math.floor(Math.random() * this.#numbers.length);
    const randomNumber = this.#numbers[randomIndex];
    return randomNumber;
  }

  isEven(number) {
    return number % 2 == 0;
  }
  
  checkWin(betChoice, betSum) {
    const result = this.getResult();
    let win = 0;

    if(typeof betChoice == 'number' && betChoice == 0) {
      if(betChoice == result) {
        win = betSum * 50;
      } else {
        win = betSum * 35
      }
    } 
    else if (betChoice === 'EVEN' || betChoice === 'ODD') {
      if ((betChoice === 'EVEN' && this.isEven(result)) || (betChoice === 'ODD' && !this.isEven(result))) {
        win = betSum * 2;
      }
    } 
    else if (betChoice === 'RED' || betChoice === 'BLACK') {
      const isBlackResult = this.blackNumbers.includes(result);
      if ((betChoice === 'BLACK' && isBlackResult) || (betChoice === 'RED' && !isBlackResult)) {
        win = betSum * 2;
      }
    }
    //TODO FIX LOGIC
    else if (betChoice == '1st 12' || betChoice == '2nd 12' || betChoice == '3rd 12') {
      const ranges = {
        '1st 12': [1, 12],
        '2nd 12': [13, 24],
        '3rd 12': [25, 36],
      };

      const [min, max] = ranges[betChoice];
      if(result >= min && result <= max) {
        win = betSum * 3;
      }
    }

    return { result, win };
  }


  //Multipliers
  //1-36: 1 to 35
  //Odd vs Even: 1 to 1
  //Red vs Black: 1 to 1
  //1st 12, 2nd 12, 3rd 12: 1 to 3
  //0: 1 to 50
}