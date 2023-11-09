import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
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
    }
  }
})

export const { startSpinning, stopSpinning } = slotMachineSlice.actions;
export default slotMachineSlice.reducer