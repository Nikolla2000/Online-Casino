import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js'
import slotReducer from '../features/slots/slotSlice.js';

export const store = configureStore({
  reducer: {
    authModals: authModalReducer,
    slot: slotReducer
  },
})
