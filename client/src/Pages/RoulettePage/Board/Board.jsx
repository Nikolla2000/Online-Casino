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
import { playSound } from '../../../utils/generalActions';
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

  // Choose bet option
  const chooseBetOption = (type, value = null) => {
    if (isSpinning) return;
    
    // Toggle off if clicking same option
    if (betType === type && betValue === value) {
      dispatch(setBetChoice({ betType: null, betValue: null }));
    } else {
      dispatch(setBetChoice({ betType: type, betValue: value }));
    }
  };

  // Increase bet
  const handleIncreaseBet = (amount) => {
    if (isSpinning) return;
    
    if (totalCredits < bet + amount) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Not enough credits');
      return;
    }
    
    dispatch(increaseBet(amount));
  };

  // Clear bet
  const handleClearBet = () => {
    if (isSpinning) return;
    dispatch(clearBet());
  };

  // Main game logic
  const handlePlaceBet = async () => {
    // Validation
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

    // Start animations
    playSound('/sounds/spin-wheel-sound.mp3', soundOn);
    dispatch(startWheelSpinning());

    // Deduct bet from credits immediately (visual feedback)
    dispatch(updateCredits(totalCredits - bet));

    try {
      // Call backend
      const res = await gameAPI.fetchPlayRouletteRound({
        betAmount: bet,
        betType: betType,
        betValue: betValue
      });

      const gameResult = res.data;

      // After 1.5s, start ball spinning
      setTimeout(() => {
        const ballAudio = playSound('/sounds/roll-ball-roulette-sound.mp3', soundOn);
        dispatch(startBallSpinning());

        // Stop wheel after 6s
        setTimeout(() => {
          dispatch(stopWheelSpinning());

          // Stop ball after 2s more
          setTimeout(() => {
            dispatch(stopBallSpinning());
            
            // Fade out ball audio
            if (ballAudio) {
              fadeOutAudio(ballAudio, 1000);
            }

            // Set result
            dispatch(setResult(gameResult.spinResult));
            dispatch(setWinState({
              isWin: gameResult.isWin,
              winAmount: gameResult.winAmount
            }));

            // Handle win
            if (gameResult.isWin) {
              playSound('/sounds/roulette-win-sound.mp3', soundOn);

              setTimeout(() => {
                playSound('/sounds/coin-payout-sound.mp3', soundOn);
                
                // Animate credits
                animateCreditsIncrement(
                  gameResult.balanceBefore - bet,
                  gameResult.balanceAfter,
                  dispatch,
                  2000
                );
              }, 1500);

              // Clear win state after animation
              setTimeout(() => {
                dispatch(clearWinState());
              }, 4000);
            } else {
              // Update to exact balance (already deducted)
              dispatch(updateCredits(gameResult.balanceAfter));
            }

            // Clear result after 3s
            setTimeout(() => {
              dispatch(clearResult());
              dispatch(stopSpinning());
            }, 3000);

          }, 2000);
        }, 6000);
      }, 1500);

    } catch (error) {
      console.error('Roulette error:', error);
      
      // Refund bet on error
      dispatch(updateCredits(totalCredits));
      dispatch(stopSpinning());
      
      toast.error(error.response?.data?.message || 'Game error. Please try again.');
      playSound('/sounds/error-sound.mp3');
    }
  };

  // Fade audio helper
  const fadeOutAudio = (audio, duration) => {
    if (!audio) return;
    
    let volume = audio.volume;
    const step = volume / (duration / 100);

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

  // Get number color class
  const getNumberClass = (num) => {
    if (num === 0) return 'green-number';
    return blackNumbers.includes(num) ? 'black-number' : 'red-number';
  };

  // Check if bet option is active
  const isBetActive = (type, value = null) => {
    return betType === type && betValue === value;
  };

  // Generate number grid
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
      {/* Coin Rain on win */}
      <CoinRain isActive={isWinning} winAmount={winAmount} />

      {/* Main Board */}
      <div className='roulette-board'>
        {/* Top Section - Numbers */}
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

        {/* Bottom Section - Outside Bets */}
        <div className="board-bottom">
          <div className='outside-bets'>
            {/* Row 1 */}
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

            {/* Row 2 */}
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

            {/* Row 3 */}
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

      {/* Chips and Controls */}
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

      {/* Game Info */}
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

      {/* Last Results */}
      <div className='last-results'>
        <span className="label">Last Results:</span>
        <div className="results-list">
          {lastResults.map((res, idx) => (
            <div 
              key={idx} 
              className={`result-bubble ${
                res.number === 0 ? 'green' :
                blackNumbers.includes(res.number) ? 'black' : 'red'
              }`}
            >
              {res.number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;