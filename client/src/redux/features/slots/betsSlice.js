import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bet: 100,
  totalCredits: 10000
}

export const betsSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {
    increaseBet(state) {
      if(state.bet === 1000) {
        return
      } else {
        state.bet += 100
      }
    },
    decreaseBet(state) {
      if(state.bet === 100) {
        return
      } else {
        state.bet -= 100
      }
    },
    maxBet(state) {
      state.bet = 1000;
    },
    spendCredits(state) {
      if(state.totalCredits < state.bet){
        return
      }
      state.totalCredits -= state.bet
    }
  }
})

export const { increaseBet, decreaseBet, maxBet, spendCredits } = betsSlice.actions;
export default betsSlice.reducer;