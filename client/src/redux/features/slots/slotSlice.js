import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bet: 100,
  totalCredits: 10000
}

export const slotSlice = createSlice({
  name: 'slot',
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

export const { increaseBet, decreaseBet } = slotSlice.actions;
export default slotSlice.reducer;