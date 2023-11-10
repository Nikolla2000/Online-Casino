import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
  isWin: false,
  winType: null,
}

export const slotMachineSlice = createSlice({
  name: 'slotMachine',
  initialState,
  reducers: {
    startSpinning(state) {
      state.isSpinning = true;
    },
    stopSpinning(state, action) {
      state.isSpinning = false;
      state.slots = action.payload;

      // if(isWinningCombination(action.payload)) {
      //   state.isWin = true;
      //   state.winType = determineWinType(action.payload);
      // } else {
      //   state.isWin = false;
      //   state.winType = null;
      // }
    }
  }
})

// const isWinningCombination = (slots) => {
//   if (slots[0] === slots[1] && slots[1] === slots[2]) {
    
//   }
// }

export const { startSpinning, stopSpinning } = slotMachineSlice.actions;
export default slotMachineSlice.reducer