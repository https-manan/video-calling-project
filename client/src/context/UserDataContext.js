import { createContext, useContext, useEffect, useState } from "react";

const UserDataContext = createContext();

export const UserDataContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUser = () => useContext(UserDataContext);
