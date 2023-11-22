import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js'
// import betsReducer from '../features/slots/betsSlice.js'
import slotsReducer from "../features/slots/slotMachineSlice.js"

export const store = configureStore({
  reducer: {
    authModals: authModalReducer,
    // bets: betsReducer,
    slotMachine: slotsReducer,
  },
})
