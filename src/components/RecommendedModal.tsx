import React from "react";
import GroupIcon from "./icons/GroupIcon";
import GpsIcon from "./icons/GpsIcon";
import AlertIcon from "./icons/AlertIcon";
import BackIcon from "./icons/BackIcon";
import RecommendedDetailContent from "./RecommendedModalWithDetail";
import "./RecommendedModal.css";

interface RecommendedModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  showDetail: boolean;
  onShowDetail: () => void;
  onBack: () => void;
}

const RecommendedModal = ({
  visible,
  onClose,
  onAccept,
  showDetail,
  onShowDetail,
  onBack,
}: RecommendedModalProps) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="recommended-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {showDetail ? (
          <RecommendedDetailContent
            onBack={onBack}
            onAccept={onAccept}
            onReject={onClose}
          />
        ) : (
          <>
            {/* 기본 추천 컨텐츠 뷰 */}
            <div className="banner-alert-container">
              <div className="banner-wrapper">
                <div className="banner">
                  <div className="banner-text">추천 컨텐츠</div>
                </div>
                <button className="alert-icon" onClick={onShowDetail}>
                  <AlertIcon width={40} height={40} />
                </button>
              </div>
            </div>

            <div className="icon-circle">
              <GroupIcon width={70} height={70} />
            </div>

            <div className="description">
              시간을 지켜라! 사라진 미래 에너지를 찾아서
            </div>

            <div className="location-row">
              <GpsIcon width={14} height={14} className="gps-icon" />
              <div className="location-text">대전역 · 822m</div>
            </div>
          </>
        )}

        {/* 공통 버튼 - 상세 모달이 아닐 때만 표시 */}
        {!showDetail && (
          <div className="button-row">
            <button className="reject-button" onClick={onClose}>
              <div className="reject-text">거절</div>
            </button>
            <button className="accept-button" onClick={onAccept}>
              <div className="accept-text">수락</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedModal;
