import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js';
import slotsReducer from "../features/slots/slotMachineSlice.js";
import rouletteReducer from "../features/roulette/rouletteSlice.js";

export const store = configureStore({
  reducer: {
    authModals: authModalReducer,
    slotMachine: slotsReducer,
    roulette: rouletteReducer,
  },
})
