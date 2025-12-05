import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { userAPI } from "../../../services/api/userAPI";

const initialState = {
  totalCredits: null,
  isBallSpinning: false,
  isWheelSpinning: false,
  result: null,
  bet: 0
}

export const fetchTotalCredits = createAsyncThunk(
  'roulette/totalCredits',
  async () => {
    const res = await userAPI.getTotalCredits();
    return res.data.totalCredits;
  }
)

export const rouletteSlice = createSlice({
  name: 'roulette',
  initialState,
  reducers: {
    //Ball Spinning
    startSpinning(state) {
      state.isBallSpinning = true;
    },
    stopSpinning(state) {
      state.isBallSpinning = false;
    },

    //Wheel Spinning,
    startWheelSpinning(state) {
      state.isWheelSpinning = true;
    },
    stopWheelSpinning(state) {
      state.isWheelSpinning = false;
    },

    //Bet
    increaseBet(state, action) {
      state.bet += action.payload;
    },
    decreateBet(state, action) {
      const result = state.bet -= action.payload;
      state.bet = newBet > 0 ? newBet : 0;
    },

    //Result
    setResult(state, action) {
      state.result = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTotalCredits.fulfilled, (state, action) => {
      state.totalCredits = action.payload;
    })
  }
})

export const {
  startSpinning,
  stopSpinning,
  startWheelSpinning,
  stopWheelSpinning,
  setResult,
} = rouletteSlice.actions;

export default rouletteSlice.reducer;