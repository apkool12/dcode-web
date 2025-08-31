import React from "react";
import BackIcon from "./icons/BackIcon";
import GpsIcon from "./icons/GpsIcon";
import "./RecommendedModalWithDetail.css";

interface RecommendedDetailContentProps {
  onBack: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const RecommendedDetailContent: React.FC<RecommendedDetailContentProps> = ({
  onBack,
  onAccept,
  onReject,
}) => {
  return (
    <div className="recommended-detail-content">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <BackIcon width={30} height={30} />
        </button>
      </div>

      <div className="detail-title-section">
        <h1 className="modal-main-title">시간을 지켜라!</h1>
        <h2 className="sub-title">사라진 미래 에너지를 찾아서</h2>
        <div className="title-divider"></div>
      </div>

      <div className="detail-body">
        <div className="detail-location-info">
          <GpsIcon width={16} height={16} className="location-icon" />
          <span className="detail-location-text">국립중앙과학관 · 822m</span>
        </div>

        <div className="info-section">
          <div className="info-row">
            <span className="info-label">예상시간</span>
            <span className="info-value">1시간 30분 ~ 3시간 10분</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-row">
            <span className="info-label">추천인원</span>
            <span className="info-value">4명</span>
          </div>
        </div>

        <div className="synopsis-section">
          <h3 className="synopsis-label">시놉시스</h3>
          <div className="synopsis-box">
            <p>2050년, 대전의 한 연구소에서 미래를 구할</p>
            <p>차세대 에너지 루미나 셀이 사라졌다.</p>
            <p>꿈돌이는 이 사건을 해결할 여러분들을 호출했고,</p>
            <p>우리들은 대전을 돌아다니며 사건을 해결해야한다!</p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="reject-button" onClick={onReject}>
          거절
        </button>
        <button className="accept-button" onClick={onAccept}>
          수락
        </button>
      </div>
    </div>
  );
};

export default RecommendedDetailContent;
