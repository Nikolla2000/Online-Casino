import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { userAPI } from "../../../services/api/userAPI";

const initialState = {
  slots: Array.from({ length: 3 }, () => 
          Array.from({ length: 5 }, () => Math.floor(Math.random() * 12 + 1))),
  isSpinning: false,
  isWin: false,
  winType: null,
  autoPlay: false,
  bet: 100,
  totalCredits: null,
  isWinning: false,
  winningLines: [],
  soundOn: true,
  lastWinAmount: 0,
}

export const fetchTotalCredits = createAsyncThunk(
  'user/credits',
  async (_, { getState }) => {
    const state = getState();
    const userId = state.auth.user._id;
    const res = await userAPI.getTotalCredits(userId);
    return res.data.totalCredits;
  }
)

export const slotMachineSlice = createSlice({
  name: 'slotMachine',
  initialState,
  reducers: {
    startSpinning(state) {
      state.isSpinning = true;
    },
    stopSpinning(state) {
      state.isSpinning = false;
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
        return;
      } else {
        state.bet += 100
      }
    },
    decreaseBet(state) {
      if(state.bet === 100) {
        return;
      } else {
        state.bet -= 100
      }
    },
    maxBet(state) {
      state.bet = 1000;
    },
    doubleBet(state) {
      if (state.bet * 2 > 1000) {
        state.bet = 1000;
        return;
      } else {
        state.bet = state.bet * 2;
      }
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
    setSlots(state, action) {
      state.slots = action.payload;
    },
    setIsWinning: (state, action) => {
      state.isWinning = action.payload;
    },
    setWinningLines: (state, action) => {
      state.winningLines = action.payload;
    },
    toggleSound: (state) => {
      state.soundOn = !state.soundOn;
    },
    setLastWinAmount: (state, action) => {
      state.lastWinAmount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTotalCredits.fulfilled, (state, action) => {
      state.totalCredits = action.payload;
    })
  }
});

export const {startSpinning, 
              stopSpinning, 
              toggleAutoPlay,
              increaseBet, 
              decreaseBet, 
              maxBet, 
              maxCredits, 
              spendCredits, 
              updateCredits,
              doubleBet,
              setSlots,
              setIsWinning, 
              setWinningLines,
              toggleSound,
              setLastWinAmount,
            } = slotMachineSlice.actions;

export default slotMachineSlice.reducer