import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "../../../services/api/userAPI";

const initialState = {
  totalCredits: null,
  soundOn: true,

  isBallSpinning: false,
  isWheelSpinning: false,
  isSpinning: false,
  
  bet: 0,
  betType: null,
  betValue: null,
  
  result: null,
  isWin: false,
  winAmount: 0,
  
  lastResults: [],
  isWinning: false,
};

export const fetchTotalCredits = createAsyncThunk(
  'user/totalCredits',
  async () => {
    const res = await userAPI.getTotalCredits();
    return res.data.totalCredits;
  }
)

export const rouletteSlice = createSlice({
  name: 'roulette',
  initialState,
  reducers: {
    // Ball Spinning
    startBallSpinning(state) {
      state.isBallSpinning = true;
      state.isSpinning = true;
    },
    stopBallSpinning(state) {
      state.isBallSpinning = false;
    },

    // Wheel Spinning
    startWheelSpinning(state) {
      state.isWheelSpinning = true;
      state.isSpinning = true;
    },
    stopWheelSpinning(state) {
      state.isWheelSpinning = false;
    },
    updateCredits(state, action) {
      state.totalCredits = action.payload;
    },

    // Stop all spinning
    stopSpinning(state) {
      state.isSpinning = false;
      state.isBallSpinning = false;
      state.isWheelSpinning = false;
    },

    // Bet management
    setBet(state, action) {
      state.bet = action.payload;
    },
    increaseBet(state, action) {
      const newBet = state.bet + action.payload;
      state.bet = newBet <= 500 ? newBet : 500; // Max bet 500
    },
    clearBet(state) {
      state.bet = 0;
      state.betType = null;
      state.betValue = null;
    },

    // Bet choice
    setBetChoice(state, action) {
      const { betType, betValue } = action.payload;
      state.betType = betType;
      state.betValue = betValue;
    },

    // Result
    setResult(state, action) {
      state.result = action.payload;
      
      // Add to history (max 10)
      state.lastResults = [action.payload, ...state.lastResults].slice(0, 10);
    },
    clearResult(state) {
      state.result = null;
    },

    // Win state
    setWinState(state, action) {
      state.isWin = action.payload.isWin;
      state.winAmount = action.payload.winAmount;
      state.isWinning = action.payload.isWin;
    },
    clearWinState(state) {
      state.isWinning = false;
    },

    // Reset game
    resetGame(state) {
      state.bet = 0;
      state.betType = null;
      state.betValue = null;
      state.result = null;
      state.isWin = false;
      state.winAmount = 0;
      state.isSpinning = false;
      state.isBallSpinning = false;
      state.isWheelSpinning = false;
      state.isWinning = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTotalCredits.fulfilled, (state, action) => {
      state.totalCredits = action.payload;
    })
  }
});

export const {
  startBallSpinning,
  stopBallSpinning,
  startWheelSpinning,
  stopWheelSpinning,
  stopSpinning,
  setBet,
  increaseBet,
  clearBet,
  setBetChoice,
  setResult,
  clearResult,
  setWinState,
  clearWinState,
  resetGame,
  updateCredits,
} = rouletteSlice.actions;

export default rouletteSlice.reducer;