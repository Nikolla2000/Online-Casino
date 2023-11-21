import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import checkSlotWin from "../../../hooks/checkSlotWin";
import { twoColsWin } from "./betsSlice";


const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
  isWin: false,
  winType: null,
  autoPlay: false
}

export const updateCreditsOnServer = createAsyncThunk(
  "slotMachine/updateCreditsOnServer",
  async(totalCredits) => {
    try {
      const response = await axios.put("server/v1/user/updateCredits", {
        totalCredits
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
)

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
      
      checkSlotWin(state.slots)
    },
    toggleAutoPlay(state) {
      state.autoPlay = !state.autoPlay;
    },
    autoPlayOff(state) {
      state.autoPlay = false;
    }
  },
});

// const isWinningCombination = (slots) => {
//   for(let i = 0; i < slots.length; i++) {

//     if( slots[i][0] === slots[i][1] 
//      && slots[i][1] === slots[i][2]
//      && slots[i][2] === slots[i][3]
//      && slots[i][3] === slots[i][4]) {
//       alert('5 cols')

//     } else if (slots[i][0] === slots[i][1] 
//             && slots[i][1] === slots[i][2]
//             && slots[i][2] === slots[i][3]
//       ) {
//         alert('4 cols')
//       }
//       else if (slots[i][0] === slots[i][1] 
//             && slots[i][1] === slots[i][2]) {
//           alert('3 cols')
//         }
//       else if (slots[i][0] === slots[i][1]){
//         alert('2 cols')
//         store.dispatch(twoColsWin())
//       }
//   }
// }

export const { startSpinning, stopSpinning, toggleAutoPlay } = slotMachineSlice.actions;
export default slotMachineSlice.reducer