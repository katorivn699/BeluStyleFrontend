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
    const token = localStorage.getItem("AuthToken");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    let user = null;

    if (token) {
      user = jwtDecode(token);
      setIsLoggedIn(true);
      if (user.user_image) {
        setAvatarUrl(user.user_image);
      } else {
        setAvatarUrl(userDefault);
      }
      setUsername(user.username || null);
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
