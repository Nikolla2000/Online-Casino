// Board/Board.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  startBallSpinning,
  startWheelSpinning,
  stopWheelSpinning,
  stopBallSpinning,
  stopSpinning,
  setBet,
  increaseBet,
  clearBet,
  setBetChoice,
  setResult,
  setWinState,
  clearWinState,
  clearResult,
  fetchTotalCredits,
  updateCredits,
} from '../../../redux/features/roulette/rouletteSlice';
import { animateCreditsIncrement } from '../../../utils/slotsUtils';
import CoinRain from '../../SlotsPage/Gadgets/CoinRain'
import { fadeOutAudio, playSound } from '../../../utils/generalActions';
import { gameAPI } from '../../../services/api/gameAPI.JS';

const Board = () => {
  const dispatch = useDispatch();
  
  const {
    totalCredits,
    soundOn,
    bet, 
    betType, 
    betValue, 
    isSpinning, 
    result,
    lastResults,
    isWinning,
    winAmount
  } = useSelector(state => state.roulette);

  const { user, accessToken } = useSelector(state => state.auth);

  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const chips = [5, 10, 25, 50, 100];

  useEffect(() => {
    if (user && accessToken) {
      dispatch(fetchTotalCredits());
    }
  }, [user, dispatch]);

  const chooseBetOption = (type, value = null) => {
    if (isSpinning) return;
    
    if (betType === type && betValue === value) {
      dispatch(setBetChoice({ betType: null, betValue: null }));
    } else {
      dispatch(setBetChoice({ betType: type, betValue: value }));
    }
  };

  const handleIncreaseBet = (amount) => {
    if (isSpinning) return;
    
    if (totalCredits < bet + amount) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Not enough credits');
      return;
    }
    
    dispatch(increaseBet(amount));
  };

  const handleClearBet = () => {
    if (isSpinning) return;
    dispatch(clearBet());
  };

  // Main game logic
  const handlePlaceBet = async () => {

    if (isSpinning) return;

    if (totalCredits < bet) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Not enough credits');
      return;
    }

    if (bet === 0) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Please place a bet');
      return;
    }

    if (!betType) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Please choose a betting option');
      return;
    }

    playSound('/sounds/spin-wheel-sound.mp3', soundOn);
    dispatch(startWheelSpinning());

    dispatch(updateCredits(totalCredits - bet));

    try {
      const res = await gameAPI.fetchPlayRouletteRound({
        betAmount: bet,
        betType: betType,
        betValue: betValue
      });

      const gameResult = res.data;

      setTimeout(() => {
        const ballAudio = playSound('/sounds/roll-ball-roulette-sound.mp3', soundOn);
        dispatch(startBallSpinning());

        setTimeout(() => {
          dispatch(stopWheelSpinning());

          setTimeout(() => {
            dispatch(stopBallSpinning());
            
            if (ballAudio) {
              fadeOutAudio(ballAudio, 1000);
              console.log("adwawd")
            }
            ballAudio.pause();


            dispatch(setResult(gameResult.spinResult));
            dispatch(setWinState({
              isWin: gameResult.isWin,
              winAmount: gameResult.winAmount
            }));

            if (gameResult.isWin) {
              playSound('/sounds/roulette-win-sound.mp3', soundOn);

              setTimeout(() => {
                playSound('/sounds/coin-payout-sound.mp3', soundOn);
                
                animateCreditsIncrement(
                  gameResult.balanceBefore - bet,
                  gameResult.balanceAfter,
                  dispatch,
                  2000
                );
              }, 1500);

              setTimeout(() => {
                dispatch(clearWinState());
              }, 4000);
            } else {
              dispatch(updateCredits(gameResult.balanceAfter));
            }

            setTimeout(() => {
              dispatch(clearResult());
              dispatch(stopSpinning());
            }, 3000);

          }, 2000);
        }, 6000);
      }, 1500);

    } catch (error) {
      console.error('Roulette error:', error);
      
      dispatch(updateCredits(totalCredits));
      dispatch(stopSpinning());
      
      toast.error(error.response?.data?.message || 'Game error. Please try again.');
      playSound('/sounds/error-sound.mp3');
    }
  };

  const getNumberClass = (num) => {
    if (num === 0) return 'green-number';
    return blackNumbers.includes(num) ? 'black-number' : 'red-number';
  };

  const isBetActive = (type, value = null) => {
    return betType === type && betValue === value;
  };

  const generateNumberGrid = () => {
    const rows = [];
    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <div key={i} className='board-row'>
          <div 
            className={`number-cell ${getNumberClass(i + 2)} ${isBetActive('number', i + 2) ? 'active' : ''}`}
            onClick={() => chooseBetOption('number', i + 2)}
          >
            {i + 2}
          </div>
          <div 
            className={`number-cell ${getNumberClass(i + 1)} ${isBetActive('number', i + 1) ? 'active' : ''}`}
            onClick={() => chooseBetOption('number', i + 1)}
          >
            {i + 1}
          </div>
          <div 
            className={`number-cell ${getNumberClass(i)} ${isBetActive('number', i) ? 'active' : ''}`}
            onClick={() => chooseBetOption('number', i)}
          >
            {i}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className='board-wrapper'>
      <CoinRain isActive={isWinning} winAmount={winAmount} />

      <div className='roulette-board'>
        <div className="board-top">
          <div 
            className={`zero-cell ${isBetActive('number', 0) ? 'active' : ''}`}
            onClick={() => chooseBetOption('number', 0)}
          >
            <span>0</span>
          </div>
          
          {generateNumberGrid()}
          
          <div className='columns'>
            <div 
              className={isBetActive('third_column') ? 'active' : ''}
              onClick={() => chooseBetOption('third_column')}
            >
              2:1
            </div>
            <div 
              className={isBetActive('second_column') ? 'active' : ''}
              onClick={() => chooseBetOption('second_column')}
            >
              2:1
            </div>
            <div 
              className={isBetActive('first_column') ? 'active' : ''}
              onClick={() => chooseBetOption('first_column')}
            >
              2:1
            </div>
          </div>
        </div>


        <div className="board-bottom">
          <div className='outside-bets'>

            <div className='bet-row'>
              <div 
                className={`bet-option ${isBetActive('first_dozen') ? 'active' : ''}`}
                onClick={() => chooseBetOption('first_dozen')}
              >
                1<sup>st</sup> 12
              </div>
              <div 
                className={`bet-option ${isBetActive('low') ? 'active' : ''}`}
                onClick={() => chooseBetOption('low')}
              >
                1-18
              </div>
              <div 
                className={`bet-option ${isBetActive('high') ? 'active' : ''}`}
                onClick={() => chooseBetOption('high')}
              >
                19-36
              </div>
            </div>

            <div className='bet-row'>
              <div 
                className={`bet-option ${isBetActive('second_dozen') ? 'active' : ''}`}
                onClick={() => chooseBetOption('second_dozen')}
              >
                2<sup>nd</sup> 12
              </div>
              <div 
                className={`bet-option red-bet ${isBetActive('red') ? 'active' : ''}`}
                onClick={() => chooseBetOption('red')}
              >
                <span className="bet-label">RED</span>
              </div>
              <div 
                className={`bet-option black-bet ${isBetActive('black') ? 'active' : ''}`}
                onClick={() => chooseBetOption('black')}
              >
                <span className="bet-label">BLACK</span>
              </div>
            </div>

            <div className='bet-row'>
              <div 
                className={`bet-option ${isBetActive('third_dozen') ? 'active' : ''}`}
                onClick={() => chooseBetOption('third_dozen')}
              >
                3<sup>rd</sup> 12
              </div>
              <div 
                className={`bet-option ${isBetActive('odd') ? 'active' : ''}`}
                onClick={() => chooseBetOption('odd')}
              >
                ODD
              </div>
              <div 
                className={`bet-option ${isBetActive('even') ? 'active' : ''}`}
                onClick={() => chooseBetOption('even')}
              >
                EVEN
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button 
          className='clear-bet-btn'
          onClick={handleClearBet}
          disabled={isSpinning}
        >
          Clear Bet
        </button>

        <div className="chips">
          {chips.map(chip => (
            <div
              key={chip}
              className={`chip chip-${chip} ${bet >= chip ? 'affordable' : ''}`}
              onClick={() => handleIncreaseBet(chip)}
            >
              <img 
                src={`/images/roulette/chip-${chip}.png`} 
                alt={`${chip} chip`}
              />
              {/* <span className="chip-value">{chip}</span> */}
            </div>
          ))}
        </div>

        <button 
          className={`place-bet-btn ${isSpinning ? 'spinning' : ''}`}
          onClick={handlePlaceBet}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Place Bet'}
        </button>
      </div>

      <div className='game-info'>
        <div className='info-item'>
          <span className="label">Credits:</span>
          <span className={`value ${isWinning ? 'winning' : ''}`}>
            ${totalCredits}
          </span>
        </div>
        <div className='info-item'>
          <span className="label">Bet:</span>
          <span className="value">${bet}</span>
        </div>
        <div className='info-item'>
          <span className="label">Choice:</span>
          <span className={`value choice ${
            betType === 'red' ? 'red' : 
            betType === 'black' ? 'black' : 
            ''
          }`}>
            {betType === 'number' ? `#${betValue}` : betType?.toUpperCase() || 'None'}
          </span>
        </div>
      </div>

      <div className='last-results'>
        <span className="label">Last Results:</span>
        <div className="results-list">
          {lastResults.map((res, idx) => (
            <div 
              key={idx} 
              className={`result-bubble ${
                res.randNumber === 0 ? 'green' :
                blackNumbers.includes(res.randNumber) ? 'black' : 'red'
              }`}
            >
              {res.randNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;