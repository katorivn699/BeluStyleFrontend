import React from "react";
import MainLayout from "../../layouts/MainLayout";
import success from "../../assets/images/success.svg";

function ForgotSuccess(){
    return(
        <MainLayout>
            <div className="successContainer flex flex-col pt-20 items-center space-y-10">
            <h1 className="font-semibold font-montserrat text-3xl">An email has been sent to your address. Please check your inbox to reset your password.</h1>
            <img src={success} className="w-96" alt="" />
            </div>
        </MainLayout>
    );
}

export default ForgotSuccess;