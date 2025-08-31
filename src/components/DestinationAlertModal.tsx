import React, { useState } from "react";
import GpsIcon from "./icons/GpsIcon";
import "./DestinationAlertModal.css";

interface DestinationAlertModalProps {
  visible: boolean;
  onClose: () => void;
  onSetAllDestinations: (destinations: string[]) => void;
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

// 목적지 거리 계산 함수
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

const DestinationAlertModal: React.FC<DestinationAlertModalProps> = ({
  visible,
  onClose,
  onSetAllDestinations,
  currentLocation,
}) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );

  // 모달이 열릴 때 초기화
  React.useEffect(() => {
    if (visible) {
      setSelectedDestinations([]);
    }
  }, [visible]);

  if (!visible) return null;

  const handleDestinationToggle = (destination: string) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(destination)) {
        return prev.filter((d) => d !== destination);
      } else {
        // 최대 3개까지만 선택 가능
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, destination];
      }
    });
  };

  const handleSetAll = () => {
    if (selectedDestinations.length >= 3) {
      // 3개만 선택되도록 제한
      const finalDestinations = selectedDestinations.slice(0, 3);
      onSetAllDestinations(finalDestinations);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedDestinations([]);
    onClose();
  };

  return (
    <div className="destination-alert-modal-overlay" onClick={handleClose}>
      <div
        className="destination-alert-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="destination-alert-modal-header">
          <div className="alert-modal-title">목적지 설정</div>
        </div>

        {/* 설명 */}
        <div className="destination-alert-description">
          모든 목적지를 설정해주세요! (최대 3개 선택 가능)
        </div>

        {/* 목적지 목록 */}
        <div className="destination-alert-list">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className={`destination-alert-item ${
                selectedDestinations.includes(destination) ? "selected" : ""
              }`}
              onClick={() => handleDestinationToggle(destination)}
            >
              <div className="destination-alert-icon">
                <GpsIcon width={16} height={16} />
              </div>
              <div className="destination-alert-name">{destination}</div>
              <div className="destination-alert-distance">
                {getDestinationDistance(destination, currentLocation)}
              </div>
              {selectedDestinations.includes(destination) && (
                <div className="selected-alert-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* 선택된 개수 표시 */}
        <div className="selection-count">
          선택된 목적지: {selectedDestinations.length}/3
        </div>

        {/* 선택된 목적지 순서 표시 */}
        {selectedDestinations.length > 0 && (
          <div className="selected-order">
            <div className="order-title">선택 순서:</div>
            <div className="order-list">
              {selectedDestinations.map((destination, index) => (
                <div key={index} className="order-item">
                  <span className="order-number">{index + 1}</span>
                  <span className="order-destination">{destination}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="destination-alert-button-row">
          <button className="cancel-button" onClick={handleClose}>
            <div className="cancel-text">취소</div>
          </button>
          <button
            className={`set-all-button ${
              selectedDestinations.length >= 3 ? "active" : "disabled"
            }`}
            onClick={handleSetAll}
            disabled={selectedDestinations.length < 3}
          >
            <div className="set-all-text">모든 목적지 설정</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationAlertModal;
