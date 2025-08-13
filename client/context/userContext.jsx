import { createContext, useState, useEffect } from "react";
import axios from "../src/axiosConfig";
import { useDispatch } from "react-redux";
import { fetchCurrentUser, refresh } from "../src/redux/features/auth/authSlice";

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if(!user) {
      axios.get('/user/profile')
      .then(({ data }) => setUser(data))
    }
  }, [])

  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
  
    const initializeAuth = async () => {
      try {
        const resultAction = await dispatch(refresh());
        if (refresh.fulfilled.match(resultAction)) {
          const token = resultAction.payload.accessToken;
          if (isMounted) {
            await dispatch(fetchCurrentUser(token));
          }
        } else {
          // 
        }
      } catch (error) {
        console.error('Refresh failed', error);
      }
    };
  
    initializeAuth();
  
    return () => { isMounted = false; }
  }, [dispatch]);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}