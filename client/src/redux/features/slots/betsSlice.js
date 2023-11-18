import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bet: 100,
  totalCredits: null
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
    maxCredits(state) {
      state.totalCredits = 10000;
    },
    spendCredits(state) {
      if(state.totalCredits < state.bet){
        return
      }
      state.totalCredits -= state.bet
    },
    updateCredits(state, action) {
      state.totalCredits = action.payload
    }
  }
})

export const { increaseBet, decreaseBet, maxBet, maxCredits, spendCredits, updateCredits } = betsSlice.actions;
export default betsSlice.reducer;