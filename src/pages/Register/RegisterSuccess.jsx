import Lottie from "lottie-react";
import React from "react";
import RegSuccess from "../../assets/anim/RegisterSuccess.json";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegisterSuccess = (email) => {
  localStorage.removeItem("mail");
  const navigate = useNavigate();

  const handleReturnToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="RegisterConfirm flex flex-col items-center py-24">
        <div className="MailSended w-44">
          <Lottie animationData={RegSuccess} loop={false} />
        </div>
        <div className="content font-poppins text-center">
          <p className="text-xl">Register Success</p>
          <p className="pt-3">Please go to login to get Access</p>
        </div>
        <div className="button flex pt-6">
          <button
            className="btn Return btn flex bg-blueOcean text-white rounded items-center space-x-2 font-inter shadow-none border-none w-44 justify-center h-12"
            onClick={handleReturnToHome}
          >
            <p>Return to Site</p>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterSuccess;
