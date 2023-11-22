import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import checkSlotWin from "../../../hooks/checkSlotWin";
// import { twoColsWin } from "./betsSlice";


const initialState = {
  slots: Array.from({ length: 3 }, () => Array(5).fill(Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
  isWin: false,
  winType: null,
  autoPlay: false,
  bet: 100,
  totalCredits: null
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
      
      // checkSlotWin(state.slots, twoColsWin)
    },
    toggleAutoPlay(state) {
      state.autoPlay = !state.autoPlay;
    },
    autoPlayOff(state) {
      state.autoPlay = false;
    },

    //Bets Reducers
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
  },
});

//DA NAPRAVQ CREATE ASYNC THUNK ZA UPDATE REQUEST

const checkSlotWin = (slots, callback) => {

  for (let i = 0; i < slots.length; i++) {
    if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3] &&
      slots[i][3] === slots[i][4]
    ) {
      alert("5 cols");
    } 
    else if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3]
    ) {
      alert("4 cols");
    } 
    else if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
      alert("3 cols");
    } 
    else if (slots[i][0] === slots[i][1]) {
    }
  }
};

export const {startSpinning, 
              stopSpinning, 
              toggleAutoPlay,
              increaseBet, 
              decreaseBet, 
              maxBet, 
              maxCredits, 
              spendCredits, 
              updateCredits,
              twoColsWin,
              threeColsWin,
              fourColsWin,
              fiveColsWin
            } = slotMachineSlice.actions;

export default slotMachineSlice.reducer