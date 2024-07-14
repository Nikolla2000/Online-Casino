import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isBallSpinning: false,
  isWheelSpinning: false,
  result: null,
  bet: 0
}

export const rouletteSlice = createSlice({
  name: 'roulette',
  initialState,
  reducers: {
    //Ball Spinning
    startSpinning(state) {
      state.isBallSpinning = true;
    },
    stopSpinning(state) {
      state.isBallSpinning = false;
    },

    //Wheel Spinning,
    startWheelSpinning(state) {
      state.isWheelSpinning = true;
    },
    stopWheelSpinning(state) {
      state.isWheelSpinning = false;
    },

    //Bet
    increaseBet(state, action) {
      state.bet += action.payload;
    },
    decreateBet(state, action) {
      const result = state.bet -= action.payload;
      state.bet = newBet > 0 ? newBet : 0;
    },

    //Result
    setResult(state, action) {
      state.result = action.payload;
    }
  }
})

export const {
  startSpinning,
  stopSpinning,
  startWheelSpinning,
  stopWheelSpinning,
  setResult,
} = rouletteSlice.actions;

export default rouletteSlice.reducer;