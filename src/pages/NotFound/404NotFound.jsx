import React from "react";
import error from "../../assets/images/404.png";
import { Link } from "react-router-dom";

export function ErrorNotFound() {
    return (
        <div className="NotFound bg-blueOcean-lighter h-screen flex flex-col items-center justify-center text-center font-nunito font-bold text-5xl space-y-10">
            <img src={error} alt="404 Not Found" />
            <p>Maybe this page moved? Got deleted? <br /> is hiding out in quarantine? Never existed <br /> in the first place?</p>
            <p>Let’s go <Link className="text-white" to="/">Home</Link> and try from here.</p>
        </div>
    );
}
