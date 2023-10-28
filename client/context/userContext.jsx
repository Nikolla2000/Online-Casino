import { createContext, useState, useEffect } from "react";
import axios from "../src/axiosConfig";

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if(!user) {
      axios.get('/user/profile')
      .then(({ data }) => setUser(data))
    }
  }, [])

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}