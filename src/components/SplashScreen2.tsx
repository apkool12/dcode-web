import React from "react";
import "./SplashScreen2.css";

const SplashScreen2: React.FC = () => {
  return (
    <div className="splash2-container">
      <div className="text-container">
        <div className="top-text">
          대전을 해석하다 <span className="brand">D-CODE</span>
        </div>

        <div className="main-text">
          지루한 <span className="blue">대전</span>?
        </div>
        <div className="main-text">
          재밌는 <span className="blue">대전</span>!
        </div>
      </div>

      <img
        src="/src/assets/images/ggumdol.png"
        alt="꿈돌이"
        className="splash2-image"
      />
    </div>
  );
};

export default SplashScreen2;
