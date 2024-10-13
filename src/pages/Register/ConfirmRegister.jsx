import React, { useEffect } from "react";
import Lottie from "lottie-react";
import MailVer from "../../assets/anim/Mailverification.json";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export function ConfirmRegister() {
    const email = localStorage.getItem("mail");
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate(-1); // Redirect back if no email is found
        }
    }, [email, navigate]);

    const handleResendEmail = () => {
        // Logic to resend verification email
        console.log("Resend email logic goes here");
    };

    const handleReturnToSite = () => {
        navigate("/"); // Redirect to home page or any other page
    };

    return (
        <div className="RegisterConfirm flex flex-col items-center py-24">
            <div className="MailSended w-44">
                <Lottie animationData={MailVer} loop={false} />
            </div>
            <div className="contextMail font-inter text-center space-y-10 py-10">
                <h1 className="text-5xl">Verify your email address</h1>
                <p>We have sent a verification link to {email}.</p>
                <p>Please confirm to complete the verification process.
                    Once it’s done you will be able to start shopping!</p>
            </div>
            <div className="button flex space-x-5">
                <button className="btn bg-blueOcean rounded-2xl font-inter text-white w-44" onClick={handleResendEmail}>
                    <p>Resend email</p>
                </button>
                <button className="btnReturn btn flex" onClick={handleReturnToSite}>
                    <p>Return to Site</p><FaArrowRight />
                </button>
            </div>
            <p className="py-20 font-inter text-gray-500">This process will be as quick as the way your money gone.</p>
        </div>
    );
}
