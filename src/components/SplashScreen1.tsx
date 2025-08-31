import React from "react";
import "./SplashScreen1.css";
import daejeonImage from "../assets/images/daejeon.png";
import cityPixelImage from "../assets/images/city-pixel.png";

const SplashScreen1: React.FC = () => {
  return (
    <div className="splash-container">
      <div className="splash1-logo-container">
        <div className="splash1-logo-text">
          <span className="d-blue">D</span>
          <span className="code">-CODE</span>
        </div>
        <div className="splash1-subtitle">
          <span className="city-blue">대전</span>을 해석하다
        </div>
        <div className="city-name-container">
          <img
            src={daejeonImage}
            alt="대전"
            className="city-icon"
          />
          <span className="city-name">대전광역시</span>
        </div>
      </div>

      <img
        src={cityPixelImage}
        alt="도시 픽셀"
        className="city-image"
      />
    </div>
  );
};

export default SplashScreen1;
