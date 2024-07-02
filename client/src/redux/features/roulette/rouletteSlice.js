import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isBallSpinning: false,
  bet: 0
}

export const rouletteSlice = createSlice({
  name: 'roulette',
  initialState,
  reducers: {
    startSpinning(state) {
      state.isBallSpinning = true;
    },
    stopSpinning(state) {
      state.isBallSpinning = false;
    },
    increaseBet(state, action) {
      state.bet += action.payload;
    },
    decreateBet(state, action) {
      const result = state.bet -= action.payload;
      state.bet = newBet > 0 ? newBet : 0;
    }
  }
})

export const {
  startSpinning,
  stopSpinning,
} = rouletteSlice.actions;

export default rouletteSlice.reducer;