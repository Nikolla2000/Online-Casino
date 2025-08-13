import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js';
import slotsReducer from "../features/slots/slotMachineSlice.js";
import rouletteReducer from "../features/roulette/rouletteSlice.js";
import authReducer from "../features/auth/authSlice.js";
import { setupInterceptors } from '../../axiosConfig.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModals: authModalReducer,
    slotMachine: slotsReducer,
    roulette: rouletteReducer,
  },
})

setupInterceptors(store);
