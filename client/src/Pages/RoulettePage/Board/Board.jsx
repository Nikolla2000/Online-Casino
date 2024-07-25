import React, { useState, useEffect, useContext } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Game } from '../game';
import { UserContext } from '../../../../context/userContext';
import { fetchTotalCredits, updateTotalCredits } from '../../../lib/data';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../../../redux/features/slots/slotMachineSlice';
import toast from 'react-hot-toast';
import 'animate.css';
import { setResult, startSpinning, startWheelSpinning, stopSpinning, stopWheelSpinning } from '../../../redux/features/roulette/rouletteSlice';
import { incrementNumber } from '../../../lib/actions';
import GoBackBtn from '../../../Components/GoBackBtn/GoBackBtn';

const Board = () => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const totalCredits = useSelector(state => state.slotMachine.totalCredits);
  const result = useSelector(state => state.roulette.result);

  const [lastResult, setLastresult] = useState(null);
  const [creditsAnimation, setCreditsAnimation] = useState(false);
  const [placeBetActive, setPlaceBetActive] = useState(true);
  const [game, setGame] = useState(null);
  const [chosenOption, setChosenOption] = useState(null);
  const [bet, setBet] = useState(0);
  
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  const chips = [5, 10, 25, 50, 100];

  //Fetching total credits from the server and updating the state
  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user.id) {
        const credits = await fetchTotalCredits(user.id);
        dispatch(updateCredits(credits));
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
    const errorAudio = new Audio('/sounds/error-sound.mp3');
    if(totalCredits < sum) {
      toast.error('You donn\'t have enough credits', {
        position: 'top-center'
      })
      errorAudio.play();

    } else if (!bet || !chosenOption) {
      toast.error('You need to choose bet and a betting option', {
        position: 'top-center'
      })
      errorAudio.play();

    } else {
      const wheelAudio = new Audio('/sounds/spin-wheel-sound.mp3');
      const ballAudio = new Audio('/sounds/roll-ball-roulette-sound.mp3');
      const winAudio = new Audio('/sounds/roulette-win-sound.mp3')
      const coinPayoutAudio = new Audio('/sounds/coin-payout-sound.mp3');

      wheelAudio.play()
      dispatch(startWheelSpinning());
      dispatch(updateCredits(totalCredits - sum));
      const newCredits = totalCredits - sum;
      updateTotalCredits(user.id, newCredits);
      setPlaceBetActive(false);


      setTimeout(() => {
        ballAudio.play();
        dispatch(startSpinning());

        const interval = setInterval(() => {
          setLastresult(Math.floor(Math.random() * 37));
        }, 50)

        setTimeout(() => {
          dispatch(stopWheelSpinning());
          
          setTimeout(() => {
            dispatch(stopSpinning());
            fadeOutAudio(ballAudio, 1000); // 1 sec audio fade

            const { result, win } = game.checkWin(choice, sum);
            dispatch(setResult(result));
            clearInterval(interval);
            setLastresult(result);
            
            if(win) {
              winAudio.play();
              updateTotalCredits(user.id, newCredits + win);
              const incrementNum = incrementNumber(sum);

              setTimeout(() => {
                let current = newCredits;
                setCreditsAnimation(true);
                coinPayoutAudio.play();

                const incrementInterval = setInterval(() => {
                  if(current < newCredits + win) {
                    dispatch(updateCredits(current + incrementNum));
                    current += incrementNum;
                  } else {
                    clearInterval(incrementInterval);
                    setCreditsAnimation(false);
                  }
                }, 50)
                
              }, 1500)
            }
            
            setTimeout(async () => {
              setPlaceBetActive(true);
              dispatch(setResult(null));
            }, 1500)
          }, 2000)
  
        }, 6000)

      }, 1500)
      
    }
  }


  //Fade audio volume gradually
  const fadeOutAudio = (audio, duration) => {
    let volume = audio.volume;
    const step = volume / (duration / 100); // decrease per step

    const fadeOut = setInterval(() => {
      volume -= step;
      if (volume <= 0) {
        clearInterval(fadeOut);
        audio.pause();
        audio.currentTime = 0;
      } else {
        audio.volume = volume;
      }
    }, 100);
  };

  
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
        <div className="bet-amount-buttons">
          <button 
            className='clear-bet-btn'
            onClick={() => setBet(0)}>
              Clear Bet
            </button>
          {chips.map(chip => (
            <img 
              src={`/images/roulette/chip-${chip}.png`} 
              value={chip} 
              alt={`${chip} chip`}
              key={chip}
              onClick={() => increaseBet(chip)}/> 
          ))}
          <button 
            className={`place-bet-btn ${!placeBetActive ? 'place-bet-btn-inactive' : ''}`}
            onClick={() => playRound(chosenOption, bet)}>
              Place Bet
          </button>
        </div>
      </div>
      <div className='credits-info'>
        <div className='total-credits-wrapper'>
          <p>Credits:</p>
          <p className={creditsAnimation && 'total-credits'}>{totalCredits}</p>
        </div>
        <p>Bet: {bet}</p>
        <p>Chosen option: <span className={chosenOption == 'RED' ? 'red' : chosenOption == 'BLACK' ? 'black' : ''}>{chosenOption}</span></p>
      </div>
      <p className='result'>
          {!result ? lastResult : result}
      </p>
      <GoBackBtn path='/games'>Go Back</GoBackBtn>
    </div>
  );
};

export default Board;
