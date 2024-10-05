import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";
import userDefault from "../assets/images/userdefault.svg";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userDefault);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const userTokenString = localStorage.getItem("NextAuth");
  
    if (userTokenString) {
      try {
        const userToken = JSON.parse(userTokenString);
  
        if (userToken.token && userToken.expire) {
          const user = jwtDecode(userToken.token);
          setIsLoggedIn(true);
          setAvatarUrl(user.image || userDefault);
          setUsername(user.username || null);
        } else {
          setIsLoggedIn(false);
          setAvatarUrl(userDefault);
          setUsername(null);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        setIsLoggedIn(false);
        setAvatarUrl(userDefault);
        setUsername(null);
      }
    } else {
      setIsLoggedIn(false);
      setAvatarUrl(userDefault);
      setUsername(null);
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, setAvatarUrl, setUsername, avatarUrl, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
