import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bet: 100,
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
    }
  }
})

export const { increaseBet, decreaseBet } = betsSlice.actions;
export default betsSlice.reducer;