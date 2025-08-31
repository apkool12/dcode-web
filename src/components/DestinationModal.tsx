import React, { useState } from "react";
import BackIcon from "./icons/BackIcon";
import GpsIcon from "./icons/GpsIcon";
import "./DestinationModal.css";

interface DestinationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDestination: (destination: string) => void;
  selectedDestinations?: string[];
  currentLocation?: { lat: number; lng: number } | null;
}

const destinations = [
  "대전지질박물관",
  "대전근현대사관",
  "대전철도관사촌",
  "엑스포과학공원",
  "국립중앙과학관",
];

// 목적지 좌표 정보 (대전 지역 기준)
const destinationCoordinates = {
  대전지질박물관: { lat: 36.3504, lng: 127.3845 },
  대전근현대사관: { lat: 36.3745, lng: 127.3726 },
  대전철도관사촌: { lat: 36.3324, lng: 127.4334 },
  엑스포과학공원: { lat: 36.3745, lng: 127.3726 },
  국립중앙과학관: { lat: 36.3745, lng: 127.3726 },
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

// 목적지 거리 계산 함수 (currentLocation을 매개변수로 받음)
const getDestinationDistance = (
  destinationName: string,
  currentLocation: { lat: number; lng: number } | null
): string => {
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

const DestinationModal: React.FC<DestinationModalProps> = ({
  visible,
  onClose,
  onSelectDestination,
  selectedDestinations = [],
  currentLocation,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  // 모달이 닫힐 때 선택 상태 초기화
  React.useEffect(() => {
    if (!visible) {
      setSelectedDestination("");
    }
  }, [visible]);

  if (!visible) return null;

  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
  };

  const handleConfirm = () => {
    if (selectedDestination) {
      onSelectDestination(selectedDestination);
      setSelectedDestination("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedDestination("");
    onClose();
  };

  return (
    <div className="destination-modal-overlay" onClick={handleClose}>
      <div
        className="destination-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="destination-modal-header">
          <button className="back-button" onClick={handleClose}>
            <BackIcon width={24} height={24} />
          </button>
          <div className="modal-title">목적지 설정</div>
          <div className="header-spacer"></div>
        </div>

        {/* 설명 */}
        <div className="destination-description">
          방문하고 싶은 장소를 선택해주세요
        </div>

        {/* 목적지 목록 */}
        <div className="destination-list">
          {destinations.filter(
            (destination) => !selectedDestinations.includes(destination)
          ).length > 0 ? (
            destinations
              .filter(
                (destination) => !selectedDestinations.includes(destination)
              )
              .map((destination, index) => (
                <div
                  key={index}
                  className={`destination-item ${
                    selectedDestination === destination ? "selected" : ""
                  }`}
                  onClick={() => handleDestinationSelect(destination)}
                >
                  <div className="destination-icon">
                    <GpsIcon width={16} height={16} />
                  </div>
                  <div className="destination-name">{destination}</div>
                  <div className="destination-distance">
                    {getDestinationDistance(destination, currentLocation)}
                  </div>
                  {selectedDestination === destination && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))
          ) : (
            <div className="no-destinations-message">
              모든 목적지를 선택했습니다!
            </div>
          )}
        </div>

        {/* 확인 버튼 */}
        <div className="destination-button-row">
          <button
            className={`confirm-button ${
              selectedDestination ? "active" : "disabled"
            }`}
            onClick={handleConfirm}
            disabled={!selectedDestination}
          >
            <div className="confirm-text">확인</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;
