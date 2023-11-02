import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js'

export const store = configureStore({
  reducer: {
    authModals: authModalReducer
  },
})
