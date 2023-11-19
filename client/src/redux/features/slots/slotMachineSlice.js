import { createSlice } from "@reduxjs/toolkit"
import checkSlotWin from "../../../hooks/checkSlotWin";
import { twoColsWin } from "./betsSlice";

const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
  isWin: false,
  winType: null,
  autoPlay: false
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
      checkSlotWin(state.slots)
    },
    toggleAutoPlay(state) {
      state.autoPlay = !state.autoPlay;
    },
    autoPlayOff(state) {
      state.autoPlay = false;
    }
  }
})

const isWinningCombination = (slots) => {
  for(let i = 0; i < slots.length; i++) {

    if( slots[i][0] === slots[i][1] 
     && slots[i][1] === slots[i][2]
     && slots[i][2] === slots[i][3]
     && slots[i][3] === slots[i][4]) {
      alert('5 cols')

    } else if (slots[i][0] === slots[i][1] 
            && slots[i][1] === slots[i][2]
            && slots[i][2] === slots[i][3]
      ) {
        alert('4 cols')
      }
      else if (slots[i][0] === slots[i][1] 
            && slots[i][1] === slots[i][2]) {
          alert('3 cols')
        }
      else if (slots[i][0] === slots[i][1]){
        alert('2 cols')
        store.dispatch(twoColsWin())
      }
  }
}

export const { startSpinning, stopSpinning, toggleAutoPlay } = slotMachineSlice.actions;
export default slotMachineSlice.reducer