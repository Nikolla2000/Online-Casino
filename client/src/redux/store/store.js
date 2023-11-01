import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth'

export const store = configureStore({
  reducer: {
    authModals: authModalReducer
  },
})
