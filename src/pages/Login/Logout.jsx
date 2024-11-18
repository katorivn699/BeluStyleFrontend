import { useEffect } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";

function Logout(isDashboard) {
  const navigate = useNavigate();
  const signOut = useSignOut();
  useEffect(() => {
    signOut();
    if (isDashboard) {
      navigate("/LoginForStaffAndAdmin");
    } else {
      navigate(-1);
    }
  }, [isDashboard, navigate, signOut]);
  return null;
}

export default Logout;
