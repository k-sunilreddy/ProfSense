import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";
import DecryptedText from "../components/DecryptedText";

const Landing = () => {
    const navigate = useNavigate();
    const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center px-4"
            style={{ background: "linear-gradient(to right, #06293D, #061029)" }}
        >
            {/* College Logo at Top Left */}
            <div className="absolute top-4 left-4">
                <img
                    src="/AUlogo.png"
                    alt="College Logo"
                    className="w-100 h-25 object-contain"
                />
            </div>

            {/* Website (App) Logo in
             the Center */}
            <img
                src="/ProfClogo.jpeg"
                alt="Website Logo"
                className="w-60 h-60 object-contain mb-2"
            />

            {/* Animated "Welcome to Profsense" Text */}
            <BlurText
                text="Welcome to Profsense!"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-5xl font-bold text-white"
                onAnimationComplete={() => setTitleAnimationComplete(true)}
            />

            {/* Animated Description in Two Lines (after title animation) */}
            {titleAnimationComplete && (
                <p className="text-lg text-white mt-2 text-center max-w-md whitespace-pre-line">
                    <DecryptedText
                        text={"Revolutionizing faculty availability tracking.\nQuickly know who’s available and where your professors are."}
                        speed={250}
                        maxIterations={20}
                        revealDirection="start"
                        className="revealed"
                        parentClassName="all-letters"
                        encryptedClassName="encrypted"
                        animateOn="view"
                    />
                </p>
            )

            }


            {/* Login Button */}
            <button
                onClick={() => navigate("/login")}
                className="mt-8 px-8 py-4 bg-[#FD752C] text-white font-semibold rounded-full shadow-lg hover:bg-[#e06e26] transition-colors duration-300"
            >
                Click here to Login
            </button>

            {/* Footer */}
            <div className="absolute bottom-4 w-full text-center">
                <p className="text-sm text-white">
                    Designed and Developed by IV IT 2021 - 2025 batch.
                </p>
            </div>
        </div>
    );
};

export default Landing;
