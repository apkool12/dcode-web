import React, { useState, useEffect } from "react";
import RecommendedModal from "./RecommendedModal";
import JourneyPlanningScreen from "./JourneyPlanningScreen";
import NotificationModal from "./NotificationModal";
import MenuModal from "./MenuModal";
import NicknameModal from "./NicknameModal";
import {
  isFirstVisit,
  saveNickname,
  getNickname,
  updateLastLogin,
} from "../utils/userStorage";
import {
  getUnreadCount,
  initializeNotifications,
} from "../utils/notificationStorage";
import "./MainScreen.css";

const OPTIONS = [
  { label: "가족", image: "/src/assets/images/family.png" },
  { label: "친구", image: "/src/assets/images/friend.png" },
  { label: "연인", image: "/src/assets/images/lover.png" },
  { label: "혼자", image: "/src/assets/images/alone.png" },
];

interface MainScreenProps {
  onShowEnding?: (data: {
    uploadedImage?: string;
    visitedPlaces?: string[];
    userNickname?: string;
  }) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onShowEnding }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDaejeonNews, setShowDaejeonNews] = useState(false);
  const [showJourneyPlanning, setShowJourneyPlanning] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("위치 확인 중...");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleAccept = () => {
    setModalVisible(false);
    setShowDetail(false);
    setShowJourneyPlanning(true);
  };

  const handleWelcomePress = () => {
    setShowDaejeonNews(!showDaejeonNews);
  };

  const handleNicknameComplete = (nickname: string) => {
    saveNickname(nickname);
    setUserNickname(nickname);
    setShowNicknameModal(false);
  };

  // 사용자 정보 초기화
  useEffect(() => {
    const nickname = getNickname();
    setUserNickname(nickname);

    // 알림 초기화 및 읽지 않은 개수 설정
    initializeNotifications();
    setUnreadNotificationCount(getUnreadCount());

    // 첫 방문인지 확인하고 닉네임 모달 표시
    if (isFirstVisit() || !nickname) {
      setShowNicknameModal(true);
    } else {
      // 기존 사용자의 경우 마지막 로그인 시간 업데이트
      updateLastLogin();
    }
  }, []);

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation("위치 서비스를 지원하지 않습니다");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse Geocoding API를 사용하여 주소 가져오기
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );

          if (response.ok) {
            const data = await response.json();

            // 한국 주소 구조에 맞게 파싱
            const address = data.address;
            let formattedAddress = "";

            if (address) {
              // 한국 주소 구조에 맞게 파싱
              const parts = [];

              // 시/도 (대전광역시, 서울특별시 등)
              if (address.city) {
                parts.push(address.city);
              }

              // 구/군 (유성구, 서구 등)
              if (address.borough) {
                parts.push(address.borough);
              }

              // 동/읍/면 (덕명동, 둔산동 등)
              if (address.quarter) {
                parts.push(address.quarter);
              } else if (address.suburb) {
                parts.push(address.suburb);
              }

              // 도로명
              if (address.road) {
                parts.push(address.road);
              }

              // 건물번호
              if (address.house_number) {
                parts.push(address.house_number);
              }

              formattedAddress = parts.join(" ");
            }

            // 디버깅을 위해 콘솔에 출력
            console.log("주소 데이터:", data.address);
            console.log("전체 주소:", data.display_name);

            if (formattedAddress) {
              setCurrentLocation(`현재 위치 : ${formattedAddress}`);
            } else {
              // 파싱 실패 시 전체 주소에서 필요한 부분만 추출
              const fullAddress = data.display_name;
              const koreanAddress = fullAddress
                .split(", ")
                .slice(1, 4)
                .join(" ");
              setCurrentLocation(`현재 위치 : ${koreanAddress}`);
            }
          } else {
            setCurrentLocation(
              `현재 위치 : ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
          }
        } catch (error) {
          console.error("주소 변환 실패:", error);
          setCurrentLocation(
            `현재 위치 : ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          );
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        setCurrentLocation("위치를 가져올 수 없습니다");
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // 컴포넌트 마운트 시 위치 가져오기
  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (showJourneyPlanning) {
    return (
      <JourneyPlanningScreen
        onClose={() => setShowJourneyPlanning(false)}
        userNickname={userNickname}
        onShowEnding={onShowEnding}
      />
    );
  }

  return (
    <div className="main-container">
      {/* 헤더 */}
      <div className="header">
        <div className="logo-text">
          <span className="logo-blue">D</span>-CODE
        </div>
        <div className="header-icons">
          <button
            className="icon-button"
            onClick={() => setShowNotificationModal(true)}
          >
            <img src="/src/assets/icons/bell.svg" alt="알림" className="icon" />
            {unreadNotificationCount > 0 && (
              <span className="notification-badge">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            className="icon-button"
            onClick={() => setShowMenuModal(true)}
          >
            <img src="/src/assets/icons/menu.svg" alt="메뉴" className="icon" />
          </button>
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="main-wrapper">
        {showDaejeonNews ? (
          <div className="daejeon-news-container">
            <img
              src="/src/assets/images/daejeon.png"
              alt="대전"
              className="daejeon-news-image"
            />
            <div className="news-overlay">
              <div className="news-title">대전 소식</div>
              <div className="news-subtitle">
                최신 대전 정보를 확인해보세요!
              </div>
            </div>
            <button className="back-button" onClick={handleWelcomePress}>
              ← 돌아가기
            </button>
          </div>
        ) : (
          <>
            <div className="gradient-box">
              <div className="location-text">
                {isLoadingLocation ? (
                  <span className="loading-location">위치 확인 중...</span>
                ) : (
                  currentLocation
                )}
              </div>
              <button className="welcome-button" onClick={handleWelcomePress}>
                <div className="welcome-text">
                  {userNickname ? `${userNickname}님, ` : ""}
                  <br />
                  대전에 오신 것을 환영합니다!
                </div>
              </button>
            </div>

            <div className="character-circle">
              <img
                src="/src/assets/images/ggumdol_main.png"
                alt="꿈돌이"
                className="character-image"
              />
            </div>

            <div className="question-box">
              <div className="question-text">
                이번 여행은 누구와 함께하고 계신가요?
              </div>
            </div>
          </>
        )}
      </div>

      {/* 선택지 - 대전 소식 모드에서는 숨김 */}
      {!showDaejeonNews && (
        <div className="options-container">
          {OPTIONS.map((item, idx) => (
            <button
              key={idx}
              className="option-card"
              onClick={() => setModalVisible(true)}
            >
              <div className="option-image-container">
                <img
                  src={item.image}
                  alt={item.label}
                  className="option-image"
                />
              </div>
              <div className="option-label">{item.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* 하나의 모달 안에서 전환 */}
      <RecommendedModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setShowDetail(false);
        }}
        onAccept={handleAccept}
        showDetail={showDetail}
        onShowDetail={() => setShowDetail(true)}
        onBack={() => setShowDetail(false)}
      />

      {/* 알림 모달 */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onUnreadCountChange={setUnreadNotificationCount}
      />

      {/* 메뉴 모달 */}
      <MenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
      />

      {/* 닉네임 설정 모달 */}
      <NicknameModal
        visible={showNicknameModal}
        onComplete={handleNicknameComplete}
      />
    </div>
  );
};

export default MainScreen;
