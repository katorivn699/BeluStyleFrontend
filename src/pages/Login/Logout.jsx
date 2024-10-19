import { useEffect } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";


function Logout() {
    const navigate = useNavigate();
    const signOut = useSignOut();
    useEffect(() => {
        signOut();
        navigate(-1);
    }, [navigate, signOut]); 

    return null;
}

export default Logout;