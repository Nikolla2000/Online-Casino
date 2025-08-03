import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { accessToken } = useSelector((state) => state.auth);
  return Boolean(accessToken);
};
