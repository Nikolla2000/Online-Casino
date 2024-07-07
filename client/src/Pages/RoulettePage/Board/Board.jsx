import React, { useState, useEffect, useContext } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Game } from '../game';
import { UserContext } from '../../../../context/userContext';
import fetchTotalCredits from '../../../lib/data';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../../../redux/features/slots/slotMachineSlice';

const Board = () => {
  const { user } = useContext(UserContext);
  const totalCredits = useSelector(state => state.slotMachine.totalCredits);
  const dispatch = useDispatch();

  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  const [bettingTime, setBettingTime] = useState(0);
  const [seconds, setSeconds] = useState(20)
  const [hasFirstStarted, setHasFirstStarted] = useState(false);
  const [game, setGame] = useState(null);
  const chips = [5, 10, 25, 50, 100];

  const [bet, setBet] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user.id) {
        const credits = await fetchTotalCredits(user.id);
        dispatch(updateCredits(credits));
        console.log(totalCredits);
      }
    };

    fetchCredits();
    const rouletteGame = new Game(totalCredits);
    setGame(rouletteGame);
  }, [user, dispatch]);


  //Increase Bet function
  const increaseBet = (amount) => {
    setBet((oldBet) => {
      const newBet = oldBet + amount;
      return newBet >= 500 ? 500 : newBet;
    })
  }

  //Function that sets the result that you want to bet on
  const chooseOption = (option) => {
    setChosenOption(oldOption => oldOption == option ? null : option);
  }


  //Play round function
  const playRound = (choice, sum) => {
    if(bet && chosenOption) {
      game.checkWin(choice, sum);
    }
  }


  // useEffect(() => {
  //   let intervalId;
  //   let timeoutId;
  
  //   const startBetting = () => {
  //     setBettingTime(0);
  
  //     intervalId = setInterval(() => {
  //       setBettingTime((prevTime) => {
  //         if (prevTime >= 100) {
  //           clearInterval(intervalId);
  //           // Reset the countdown after 15 seconds
  //           timeoutId = setTimeout(() => {
  //             startBetting();
  //           }, 15000);
  //           return 0;
  //         } else {
  //           return prevTime + 5;
  //         }
  //       });
  //     }, 1000);
  //   };
  
  //   startBetting();
  
  //   // Clear the interval and timeout when the component is unmounted
  //   return () => {
  //     clearInterval(intervalId);
  //     clearTimeout(timeoutId);
  //   };
  // }, []);
  

  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     if(seconds > 0) {
  //       setSeconds(prevSeconds => prevSeconds - 1)   
  //     } else {
  //        clearInterval(timeout)
  //     }
  //   }, 1000)
  //   return () => clearInterval(timeout);
  // }, [seconds]
  // )

  
  const isBlackNumber = (num) => {
    return blackNumbers.includes(num) ? 'black-number' : '';
  };
  

  const generateTable = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <div key={i} className='board-row'>
          <div className={isBlackNumber(i + 2)} value={i + 2} onClick={() => chooseOption(i + 2)}>{i + 2}</div>
          <div className={isBlackNumber(i + 1)} value={i + 1} onClick={() => chooseOption(i + 1)}>{i + 1}</div>
          <div className={isBlackNumber(i)} value={i} onClick={() => chooseOption(i)}>{i}</div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className='board-and-gadgets-wrapper'>

      <div className='board'>
        <div className="board-top-side">
          <div className='zero' onClick={() => chooseOption(0)}><span>0</span></div>
          {generateTable()}
          <div className='two-one'>
            <div>2:1</div>
            <div>2:1</div>
            <div>2:1</div>
          </div>
        </div>
        
        <div className="board-bottom-side">
          <div className='bet-options'>
            <div className='option'>
              <div onClick={() => chooseOption("1st 12")}>1<sup>st</sup> 12</div>
              <div className='left-border' onClick={() => chooseOption("1 to 18")}>1 to 18</div>
              <div onClick={() => chooseOption("EVEN")}>EVEN</div>
            </div>
            <div className='option'>
              <div onClick={() => chooseOption("2nd 12")}>2<sup>nd</sup> 12</div>
              <div className='red' onClick={() => chooseOption("RED")}>black</div>
              <div className='black' onClick={() => chooseOption("BLACK")}>black</div>
            </div>
            <div className='option'>
              <div onClick={() => chooseOption("3rd 12")}>3<sup>rd</sup> 12</div>
              <div onClick={() => chooseOption("ODD")}>ODD</div>
              <div className='right-border' onClick={() => chooseOption("19 to 36")}>19 to 36</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gadgets">
        <div className="place-bet-loader">
          <h4>PLACE BET</h4>
          <h5>{seconds}</h5>
          <div className="loader">
            <ProgressBar now={bettingTime}/>
          </div>
        </div>
        <div className="bet-amount-buttons">
          <button 
            className='clear-bet-btn'
            onClick={() => setBet(0)}>
              Clear Bet
            </button>
          {chips.map(chip => (
            <img 
              src={`../../src/assets/images/roulette/chip-${chip}.png`} 
              value={chip} 
              alt={`${chip} chip`}
              key={chip}
              onClick={() => increaseBet(chip)}/> 
          ))}
          <button 
            className='place-bet-btn'
            onClick={() => playRound(chosenOption, bet)}>
              Place Bet
          </button>
        </div>
      </div>
      <div className='credits-info'>
        <p>Credits: {totalCredits}</p>
        <p>Bet: {bet}</p>
        {/* <p>Win: 0</p> */}
        <p>Chosen option: {chosenOption}</p>
      </div>
    </div>
  );
};

export default Board;
