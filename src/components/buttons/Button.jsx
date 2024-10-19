import React from "react";
import { FaCartPlus, FaShareAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { HandleLoginGoogle } from "../../service/AuthService";

export function AddToCart({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-white text-blue-500 font-bold py-2 px-4 rounded flex items-center mx-2 hover:bg-gray-50 transition-opacity duration-300"
    >
      <FaCartPlus className="mr-2" />
      Add to cart
    </button>
  );
}

export function Share({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-transparent text-white font-bold py-2 px-4 rounded flex items-center mx-2 transition-opacity duration-300 hover:bg-zinc-500 bg-opacity-20"
    >
      <FaShareAlt className="mr-2" /> Share
    </button>
  );
}

export function ShowMore({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-white text-blue-700 font-semibold font-poppins border border-blue-700 rounded-md py-2 px-4 flex items-center hover:bg-blue-700 hover:text-white transition duration-300"
    >
      Show More
    </button>
  );
}

export function LoginBtn({ onClick, tabindex = "0" }) {
  return (
    <Button 
      variant="outlined" // Dùng outlined để có border
      onClick={onClick}
      tabIndex={tabindex}
      type="submit"
      sx={{
        width: "100%", 
        color: "#000", 
        backgroundColor: "#fff", 
        borderRadius: "50px", 
        borderColor: "#000",
        textTransform: 'none', 
        fontSize: "1.25rem", 
        fontFamily: "Poppins",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Login
    </Button>
  );
}

export function ForgotBtn({ onClick, tabindex = "0" }) {
  return (
    <Button 
      variant="outlined" // Dùng outlined để có border
      onClick={onClick}
      tabIndex={tabindex}
      type="submit"
      sx={{
        width: "100%", 
        color: "#000", 
        backgroundColor: "#fff", 
        textTransform: 'none',
        borderRadius: "50px", 
        borderColor: "#000", 
        fontSize: "1.25rem", 
        fontFamily: "Poppins",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Reset password
    </Button>
  );
}
export function RegisterBtn({ onClick, tabindex = "0" }) {
  return (
    <Button 
      variant="outlined" // Dùng outlined để có border
      onClick={onClick}
      tabIndex={tabindex}
      type="submit"
      sx={{
        width: "100%", 
        color: "#000", 
        backgroundColor: "#fff", 
        borderRadius: "50px", 
        textTransform: 'none',
        borderColor: "#000", 
        fontSize: "1.25rem", 
        fontFamily: "Poppins",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Register
    </Button>
  );
}

export function LoginGooglebtn({ signIn }) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      HandleLoginGoogle(accessToken, navigate, signIn);
    },
    scope: "openid email profile",
  });

  return (
    <button onClick={() => login()} className="google-login-button">
      <FcGoogle className="icon text-3xl" />
    </button>
  );
}

export const BuyNow = () => {
  return (
    <>
      <Link>
      <Button variant="contained" size="large" sx={{
        borderRadius: "10px",
        textTransform: 'none',
        width: "200px"
      }}><Link to={"/shop"}>Buy Now</Link></Button>
      </Link>
    </>
  );
};

export const CheckOut = ({context, handleClick, isEmpty}) => {
  return(
    <>
      <Button variant="contained" size="large" sx={{
        borderRadius: "10px",
        textTransform: 'none',
        width: "200px",
        backgroundColor: "white",
        color: "black",
        border: "solid black 1px" 
      }}
      onClick={handleClick}
      disabled={isEmpty}
      >{context}</Button>
    </>
  )
}

export const Drawerbtn = ({context, handleClick, isEmpty}) => {
  return(
    <Button
            variant="contained"
            onClick={() => handleClick()}
            fullWidth
            disabled={isEmpty}
            sx={{
              backgroundColor: "white",
              color: "black",
              border: "black solid 1px",
              borderRadius: "30px"
            }}
          >
            {context}
          </Button>
  )
}