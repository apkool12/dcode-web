import React, { useState, useEffect } from "react";
import "./JourneyPlanningScreen.css";
import { LocationCard, AddDestinationButton, TimelineItem } from "./common";
import TimelineContainer from "./common/TimelineContainer";
import DestinationModal from "./DestinationModal";
import DestinationAlertModal from "./DestinationAlertModal";
import ChatScreen from "./ChatScreen";
import LockIcon from "./icons/LockIcon";
import TalkIcon from "./icons/TalkIcon";
import PuzzleIcon from "./icons/PuzzleIcon";
import NotificationModal from "./NotificationModal";
import MenuModal from "./MenuModal";
import {
  getUnreadCount,
  initializeNotifications,
} from "../utils/notificationStorage";

interface JourneyPlanningScreenProps {
  onClose: () => void;
  userNickname?: string | null;
  onShowEnding?: (data: {
    uploadedImage?: string;
    visitedPlaces?: string[];
    userNickname?: string;
  }) => void;
}

const JourneyPlanningScreen: React.FC<JourneyPlanningScreenProps> = ({
  onClose,
  userNickname,
  onShowEnding,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // 목적지 좌표 정보 (대전 지역 기준)
  const destinationCoordinates = {
    대전지질박물관: { lat: 36.3504, lng: 127.3845 },
    대전근현대사관: { lat: 36.3745, lng: 127.3726 },
    대전철도관사촌: { lat: 36.3324, lng: 127.4334 },
    엑스포과학공원: { lat: 36.3745, lng: 127.3726 },
    국립중앙과학관: { lat: 36.3745, lng: 127.3726 },
    대전시민천문대: { lat: 36.3324, lng: 127.4334 },
  };

  // 거리 계산 함수 (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 현재 위치 가져오기 및 알림 초기화
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("위치 정보를 가져올 수 없습니다:", error);
          // 기본값으로 대전역 좌표 설정
          setCurrentLocation({ lat: 36.3324, lng: 127.4334 });
        }
      );
    }

    // 알림 개수 초기화
    initializeNotifications();
    setUnreadNotificationCount(getUnreadCount());
  }, []);

  // 목적지 거리 계산
  const getDestinationDistance = (destinationName: string): string => {
    if (
      !currentLocation ||
      !destinationCoordinates[
        destinationName as keyof typeof destinationCoordinates
      ]
    ) {
      return "";
    }

    const coords =
      destinationCoordinates[
        destinationName as keyof typeof destinationCoordinates
      ];
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      coords.lat,
      coords.lng
    );

    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  const handleOpenModal = () => {
    // 모든 목적지가 설정되지 않은 경우 alert 모달 표시
    const emptyCount = selectedDestinations.filter(
      (dest) => dest === ""
    ).length;
    if (emptyCount === 3) {
      setIsAlertModalVisible(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectDestination = (destination: string) => {
    // 빈 슬롯에 목적지 추가
    const emptyIndex = selectedDestinations.findIndex((dest) => dest === "");
    if (emptyIndex !== -1) {
      const newDestinations = [...selectedDestinations];
      newDestinations[emptyIndex] = destination;
      setSelectedDestinations(newDestinations);
    }
  };

  const handleSetAllDestinations = (destinations: string[]) => {
    setSelectedDestinations(destinations);
  };

  const handleProceed = () => {
    // 모든 목적지가 설정되었는지 확인
    const emptyCount = selectedDestinations.filter(
      (dest) => dest === ""
    ).length;
    if (emptyCount > 0) {
      // 경고창 표시
      alert("모든 목적지를 설정해주세요!");
      return;
    }

    // 모든 목적지가 설정된 경우에만 챗봇 화면으로 이동
    setShowChatScreen(true);
  };

  const handleRemoveDestination = (index: number) => {
    const newDestinations = [...selectedDestinations];
    newDestinations[index] = "";
    setSelectedDestinations(newDestinations);
  };

  // ChatScreen이 표시되어야 하는 경우
  if (showChatScreen) {
    return (
      <ChatScreen
        onClose={() => setShowChatScreen(false)}
        destination="대전역"
        userNickname={userNickname}
        onShowEnding={onShowEnding}
      />
    );
  }

  return (
    <div className="journey-planning-container">
      {/* 헤더 */}
      <div className="journey-header">
        <div className="logo-text">
          <span className="logo-blue">D</span>-CODE
        </div>
        <div className="header-icons">
          <button
            className="icon-button"
            onClick={() => setShowNotificationModal(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z"
                fill="currentColor"
              />
            </svg>
            {unreadNotificationCount > 0 && (
              <span className="journey-notification-badge">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            className="icon-button"
            onClick={() => setShowMenuModal(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="journey-content">
        {/* 제목 배너 */}
        <div className="title-banner">
          <h1 className="journey-main-title">어떤 장소를 Decode 할까요?</h1>
          <p className="subtitle">
            시작 시나리오와 최종 시나리오를 제외한 목적지를 직접 정해보세요!
          </p>
        </div>

        {/* 타임라인 */}
        <TimelineContainer>
          {/* 시작점 */}
          <TimelineItem type="start" label="START">
            <LocationCard
              name="대전역"
              status={{
                text: "현재 위치에 있음",
                type: "current",
              }}
              tags={[
                { type: "conversation", text: "대화" },
                { type: "puzzle", text: "퍼즐" },
              ]}
              isLocked={true}
            />
          </TimelineItem>

          {/* 중간 목적지들 */}
          {[1, 2, 3].map((index) => (
            <TimelineItem key={index} type="destination">
              {selectedDestinations[index - 1] ? (
                <div className="selected-destination-container">
                  <div className="selected-destination-card">
                    <LockIcon size={32} color="#ffffff" />
                  </div>
                  <div className="selected-destination-info">
                    <div className="selected-destination-name">
                      {selectedDestinations[index - 1]}
                    </div>
                    <div className="selected-destination-status">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          fill="#674ab9"
                          stroke="#674ab9"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="selected-status-text">
                        {index}번째 목적지 ·{" "}
                        {getDestinationDistance(
                          selectedDestinations[index - 1]
                        )}
                      </span>
                    </div>
                    <div className="selected-destination-tags">
                      <span className="selected-tag conversation">
                        <TalkIcon size={12} />
                        대화
                      </span>
                      <span className="selected-tag puzzle">
                        <PuzzleIcon size={12} />
                        퍼즐
                      </span>
                    </div>
                  </div>

                  <button
                    className="remove-destination-btn"
                    onClick={() => handleRemoveDestination(index - 1)}
                    title="목적지 제거"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <AddDestinationButton onClick={handleOpenModal} />
              )}
            </TimelineItem>
          ))}

          {/* 종료점 */}
          <TimelineItem type="end" label="EXIT">
            <LocationCard
              name="대전시민천문대"
              status={{
                text: `${getDestinationDistance("대전시민천문대")} 떨어져있음`,
                type: "distance",
              }}
              tags={[
                { type: "conversation", text: "대화" },
                { type: "puzzle", text: "퍼즐" },
                { type: "walking", text: "도보수" },
              ]}
              isLocked={true}
            />
          </TimelineItem>
        </TimelineContainer>
      </div>

      {/* 하단 버튼 */}
      <div className="journey-footer">
        <button className="proceed-button" onClick={handleProceed}>
          진행하기
        </button>
      </div>

      {/* 목적지 설정 모달 */}
      <DestinationModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSelectDestination={handleSelectDestination}
        selectedDestinations={selectedDestinations}
        currentLocation={currentLocation}
      />

      {/* 목적지 설정 Alert 모달 */}
      <DestinationAlertModal
        visible={isAlertModalVisible}
        onClose={() => setIsAlertModalVisible(false)}
        onSetAllDestinations={handleSetAllDestinations}
        currentLocation={currentLocation}
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
    </div>
  );
};

export default JourneyPlanningScreen;
