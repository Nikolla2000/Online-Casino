import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js'
import betsReducer from '../features/slots/betsSlice.js'

export const store = configureStore({
  reducer: {
    authModals: authModalReducer,
    bets: betsReducer
  },
})
