import React, { useState, useEffect } from "react";
import "./EndingScreen.css";
import familyImage from "../assets/images/family.png";
import presentIcon from "../assets/images/present.svg";
import coffeetIcon from "../assets/images/coffee.svg";

interface EndingScreenProps {
  onClose: () => void;
  uploadedImage?: string;
  visitedPlaces?: string[];
  userNickname?: string;
}

const EndingScreen: React.FC<EndingScreenProps> = ({
  onClose,
  visitedPlaces = [],
  userNickname,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [showActualGift, setShowActualGift] = useState(false);

  // 방문한 장소들 (예시 데이터)
  const defaultPlaces = [
    "대전시립미술관",
    "한밭수목원",
    "대전과학관",
    "엑스포과학공원",
    "성심당",
  ];

  const finalPlaces = visitedPlaces.length > 0 ? visitedPlaces : defaultPlaces;

  useEffect(() => {
    if (currentStep === 0) {
      // 첫 번째 화면 애니메이션
      const timer1 = setTimeout(() => setShowTitle(true), 500);
      const timer2 = setTimeout(() => setShowCharacters(true), 1500);
      const timer3 = setTimeout(() => setShowGiftBox(true), 2500);
      const timer4 = setTimeout(() => setShowMessage(true), 3500);
      const timer5 = setTimeout(() => setShowButton(true), 4500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    } else {
      // 두 번째 화면 애니메이션 - 즉시 시작
      setShowPlaces(true);
      const timer1 = setTimeout(() => setShowActualGift(true), 800);
      const timer2 = setTimeout(() => setShowCharacters(true), 1600);
      const timer3 = setTimeout(() => setShowButton(true), 2400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentStep]);

  const handleNextStep = () => {
    setCurrentStep(1);
    // 상태 초기화 제거 - 자연스러운 전환을 위해
  };

  const handleClose = () => {
    onClose();
  };

  if (currentStep === 0) {
    // 첫 번째 화면: 선물 상자
    return (
      <div className="ending-screen">
        <div className="ending-background">
          <div className="ending-content">
            {/* 제목 */}
            <div className={`ending-title ${showTitle ? "show" : ""}`}>
              <h1>대전을 해석하다 D-CODE</h1>
              <p className="subtitle">
                {userNickname ? `${userNickname}님` : "여행자"}이(가) 모든
                장소를 디코드했습니다!
              </p>
            </div>

            {/* 캐릭터들 */}
            <div
              className={`ending-characters ${showCharacters ? "show" : ""}`}
            >
              <img
                src={familyImage}
                alt="꿈돌이 가족"
                className="family-image"
              />
            </div>

            {/* 선물 상자 */}
            <div className={`ending-gift-box ${showGiftBox ? "show" : ""}`}>
              <div className="gift-box-container">
                <img
                  src={presentIcon}
                  alt="선물 상자"
                  className="gift-box-icon"
                />
                <div className="gift-box-glow"></div>
              </div>
            </div>

            {/* 메시지 */}
            <div className={`ending-message ${showMessage ? "show" : ""}`}>
              <div className=".ending-message-text {">
                <div className="gift-message">
                  꿈돌이 가족이 선물을 준비했어요!
                </div>
                <div className="gift-subtitle">어떤 선물이 나올까요?</div>
              </div>
            </div>

            {/* 버튼 */}
            <div
              className={`ending-button-container ${showButton ? "show" : ""}`}
            >
              <button className="ending-button" onClick={handleNextStep}>
                선물 받기
              </button>
            </div>
          </div>

          {/* 배경 효과 */}
          <div className="ending-effects">
            <div className="floating-particles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 두 번째 화면: 실제 선물
  return (
    <div className="ending-screen">
      <div className="ending-background">
        <div className="ending-content">
          {/* 방문한 장소들 */}
          <div className={`ending-places ${showPlaces ? "show" : ""}`}>
            <h2>해석된 장소들</h2>
            <div className="places-list">
              {finalPlaces.map((place, index) => (
                <div
                  key={index}
                  className="place-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <span className="place-number">{index + 1}</span>
                  <span className="place-name">{place}</span>
                  <span className="place-check">✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* 실제 선물 */}
          <div className={`ending-actual-gift ${showActualGift ? "show" : ""}`}>
            <div className="gift-container">
              <img src={coffeetIcon} alt="선물 상자" className="coffee-icon" />
              <div className="gift-content">
                <div className="coupon">
                  <div className="coupon-text">
                    <div className="coupon-title">OO카페 3000원 할인권</div>
                    <div className="coupon-validity">유효기간: 30일</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 캐릭터들 */}
          <div className={`ending-characters ${showCharacters ? "show" : ""}`}>
            <img src={familyImage} alt="꿈돌이 가족" className="family-image" />
          </div>

          {/* 하단 버튼 */}
          <div
            className={`ending-button-container ${showButton ? "show" : ""}`}
          >
            <button className="ending-button" onClick={handleClose}>
              처음으로 돌아가기
            </button>
          </div>
        </div>

        {/* 배경 효과 */}
        <div className="ending-effects">
          <div className="floating-particles">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingScreen;
