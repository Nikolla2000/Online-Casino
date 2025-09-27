import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginModal: false,
  showRegisterModal: false,
  isFromGamesPage: false,
  gameLink: null,
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
    setFromGamesPage(state, action) {
      state.isFromGamesPage = true;
      state.gameLink = action.payload;
    },
    unsetGamesPage(state) {
      state.isFromGamesPage = false;
      state.gameLink = null;
    }
  }
})

export const { 
          showLogin,
          showRegister,
          hideModals,
          setFromGamesPage,
          unsetGamesPage
        } = authModalsSlice.actions;

export default authModalsSlice.reducer;