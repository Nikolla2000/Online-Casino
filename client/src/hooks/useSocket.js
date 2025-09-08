import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  initializeSocket, 
  disconnectSocket,
  setSocketConnected 
} from '../redux/features/socket/socketSlice'

export const useSocket = () => {
  const dispatch = useDispatch();
  const { socket, isConnected, loading, error } = useSelector((state) => state.socket);

  const connect = useCallback(() => {
    dispatch(initializeSocket());
  }, [dispatch]);

  const disconnect = useCallback(() => {
    dispatch(disconnectSocket());
  }, [dispatch]);

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }, [socket, isConnected]);

  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  const off = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  const once = useCallback((event, callback) => {
    if (socket) {
      socket.once(event, callback);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    once
  };
};