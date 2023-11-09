import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(null)),
  isSpinning: false,
}

export const slotMachineSlice = createSlice({
  name: 'slotMachine',
  initialState,
  reducers: {
    startSpinning(state) {
      state.isSpinning = true;
    },
    stopSpinning(state) {
      state.isSpinning = false;
      state.slots = action.payload;
    }
  }
})

export const { startSpinning, stopSpinning } = slotMachineSlice.actions;
export default slotMachineSlice.reducer