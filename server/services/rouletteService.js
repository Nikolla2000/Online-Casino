const GameService = require("./gameService");
const User = require('../models/User.model');
const { validateUserAndCredits } = require("../helpers/gameHelpers");

class RouletteService extends GameService{

    constructor(){
        this.BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        this.RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        this.GREEN_NUMBERS = [0];


        this.VALID_BET_TYPES = [
            'number',        // Single number (0-36)
            'red',           // Red numbers
            'black',         // Black numbers
            'even',          // Even numbers
            'odd',           // Odd numbers
            'low',           // 1-18
            'high',          // 19-36
            'first_dozen',   // 1-12
            'second_dozen',  // 13-24
            'third_dozen',   // 25-36
            'first_column',  // 1,4,7,10,13,16,19,22,25,28,31,34
            'second_column', // 2,5,8,11,14,17,20,23,26,29,32,35
            'third_column'   // 3,6,9,12,15,18,21,24,27,30,33,36
        ];


        this.PAYOUTS = {
            'number': 35,          // Single number: 35:1
            'red': 1,              // Red: 1:1
            'black': 1,            // Black: 1:1
            'even': 1,             // Even: 1:1
            'odd': 1,              // Odd: 1:1
            'low': 1,              // 1-18: 1:1
            'high': 1,             // 19-36: 1:1
            'first_dozen': 2,      // First dozen: 2:1
            'second_dozen': 2,     // Second dozen: 2:1
            'third_dozen': 2,      // Third dozen: 2:1
            'first_column': 2,     // First column: 2:1
            'second_column': 2,    // Second column: 2:1
            'third_column': 2      // Third column: 2:1
        };
    }

    /**
     * @param {string} userId - User ID from JWT middleware
     * @param {number} betAmount - Amount to bet (5, 10, 25, 50 or 100)
     * @param {string} betType - Type of bet
     * @returns {object} Game result
     */
    async playRound(userId, betAmount, betType, betValue = null) {

        this.validateBet(betAmount, betType, betValue);

        const user = await validateUserAndCredits(userId, betAmount, User);

        const spinResult = this.generateResult();
    }


    generateResult() {
        const randNumber = Math.floor(Math.random() * 37);
    
        let color;
        if(this.GREEN_NUMBERS.includes(randNumber)) {
            color = 'green';
        } else if (this.RED_NUMBERS.includes(randNumber)) {
            color = 'red';
        } else {
            color = 'black';
        }
    
        return {
            randNumber,
            color
        };
    }

    /**
     * Calculate win based on spin result and bet
     * @param {object} spinResult - Result from generateResult()
     * @param {string} betType - Type of bet
     * @param {number|null} betValue - 0-36 Number (for 'number' bet)
     * @param {number} betAmount - Amount wagered
     * @returns {object} Win details
     */
    calculateWin(spinResult, betType, betValue, betAmount) {
        const { number, color } = spinResult;
        let isWin = false;

        switch (betType) {
            case 'number':
                isWin = number === betValue;
                break;
            
            case 'red':
                isWin = color === 'red';
                break;

            case 'black':
                isWin = color === 'black';
                break;

            case 'even':
                isWin = number !== 0 && number != 2 === 0;
                break;

            case 'odd':
                isWin = number !== 0 && number != 2 !== 0;
                break;

            case 'low':
                isWin = number >= 1 && number <= 18;
                break;

            case 'high':
                isWin = number >= 19 && number <= 36;
                break;

            case 'first_dozen':
                isWin = number >= 1 && number <= 12;
                break;
        
            case 'second_dozen':
                isWin = number >= 13 && number <= 24;
                break;
    
            case 'third_dozen':
                isWin = number >= 25 && number <= 36;
                break;

            default:
                isWin = false;
        }

        const multiplier = isWin ? this.PAYOUTS[betType] : 0;
        const winAmount = isWin ? betAmount * (multiplier + 1) : 0;

        return {
            isWin,
            winAmount,
            multiplier
        }
    }
}

module.exports = new RouletteService();