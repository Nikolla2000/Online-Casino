import { initializeSocket, disconnectSocket, setSocketConnected } from '../features/socket/socketSlice';

const socketMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  const state = store.getState();
  const socket = state.socket.socket;

  if (type === 'auth/login/fulfilled' || type === 'auth/refresh/fulfilled') {
    if (state.auth.accessToken && !state.socket.socket) {
      store.dispatch(initializeSocket());
    }
  }

  if (type === 'auth/logout/fulfilled') {
    if (socket) {
      store.dispatch(disconnectSocket());
    }
  }

  if (socket) {
    socket.on('connect', () => {
      store.dispatch(setSocketConnected(true));
    });

    socket.on('disconnect', () => {
      store.dispatch(setSocketConnected(false));
    });
  }

  return next(action);
};

export default socketMiddleware;