import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginModal: false,
  showRegisterModal: false,
}

export const authModalsSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    showLogin(state) {
      state.showLoginModal = true;
      state.showRegisterModal = false;
    },
    showRegister(state) {
      state.showRegisterModal = true;
      state.showLoginModal = false;
    },
    hideModals(state) {
      state.showLoginModal = false;
      state.showRegisterModal = false;
    },
  }
})

export const { showLogin, showRegister, hideModals } = authModalsSlice.actions;
export default authModalsSlice.reducer;