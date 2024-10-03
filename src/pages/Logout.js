import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import userDefault from "../assets/images/userdefault.svg"


function Logout() {
    const navigate = useNavigate();
    const { setIsLoggedIn, setAvatarUrl, setUsername } = useAuth();
    useEffect(() => {

        localStorage.removeItem("AuthToken");
        setIsLoggedIn(false);
        setAvatarUrl(userDefault); 
        setUsername(null);
        
        navigate('/');
    }, [navigate, setIsLoggedIn, setAvatarUrl, setUsername]); 

    return null;
}

export default Logout;