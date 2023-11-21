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
    },
    twoColsWin(state) {
      alert('bachka')
      state.totalCredits += state.bet * 2
    },
    threeColsWin(state) {
      state.totalCredits += state.bet * 10
    },
    fourColsWin(state) {
      state.totalCredits += state.bet * 100
    },
    fiveColsWin(state) {
      state.totalCredits += state.bet * 200
    },
  }
})

export const { increaseBet, 
               decreaseBet, 
               maxBet, 
               maxCredits, 
               spendCredits, 
               updateCredits,
               twoColsWin,
               threeColsWin,
               fourColsWin,
               fiveColsWin
            } = betsSlice.actions;

export default betsSlice.reducer;