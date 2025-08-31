import { useEffect, useState } from "react";
import SplashScreen1 from "./components/SplashScreen1";
import SplashScreen2 from "./components/SplashScreen2";
import MainScreen from "./components/MainScreen";
import EndingScreen from "./components/EndingScreen";
import "./App.css";

const App = () => {
  const [step, setStep] = useState(1);
  const [showEndingScreen, setShowEndingScreen] = useState(false);
  const [endingData, setEndingData] = useState({
    uploadedImage: undefined as string | undefined,
    visitedPlaces: [] as string[],
    userNickname: undefined as string | undefined,
  });

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep(2); // 2초 후 Splash2
    }, 2000);

    const timer2 = setTimeout(() => {
      setStep(3); // 다시 2초 후 MainScreen
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleShowEnding = (data: {
    uploadedImage?: string;
    visitedPlaces?: string[];
    userNickname?: string;
  }) => {
    setEndingData({
      uploadedImage: data.uploadedImage,
      visitedPlaces: data.visitedPlaces || [],
      userNickname: data.userNickname,
    });
    setShowEndingScreen(true);
  };

  const handleEndingClose = () => {
    setShowEndingScreen(false);
    // 메인 홈으로 돌아가기
    setStep(3);
  };

  if (step === 1) return <SplashScreen1 />;
  if (step === 2) return <SplashScreen2 />;
  if (showEndingScreen) {
    return (
      <EndingScreen
        onClose={handleEndingClose}
        uploadedImage={endingData.uploadedImage}
        visitedPlaces={endingData.visitedPlaces}
        userNickname={endingData.userNickname}
      />
    );
  }
  return <MainScreen onShowEnding={handleShowEnding} />;
};

export default App;
