import React, { useState } from "react";
import "./NicknameModal.css";
import travelIcon from "../assets/icons/travel.svg";

interface NicknameModalProps {
  visible: boolean;
  onComplete: (nickname: string) => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({
  visible,
  onComplete,
}) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateNickname = (name: string): boolean => {
    if (name.length < 2) {
      setError("닉네임은 2글자 이상이어야 합니다.");
      return false;
    }
    if (name.length > 10) {
      setError("닉네임은 10글자 이하여야 합니다.");
      return false;
    }
    if (!/^[가-힣a-zA-Z0-9\s]+$/.test(name)) {
      setError("닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!validateNickname(trimmedNickname)) {
      return;
    }

    setIsSubmitting(true);

    // 짧은 로딩 효과
    setTimeout(() => {
      onComplete(trimmedNickname);
      setIsSubmitting(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    // 실시간 유효성 검사
    if (value.trim()) {
      validateNickname(value.trim());
    } else {
      setError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit(e as any);
    }
  };

  if (!visible) return null;

  return (
    <div className="nickname-modal-overlay">
      <div className="nickname-modal-container">
        {/* 헤더 */}
        <div className="nickname-modal-header">
          <div className="welcome-icon">
            <img src={travelIcon} alt="여행" />
          </div>
          <h2 className="welcome-title">대전을 해석하실 준비가 되셨나요?</h2>
          <p className="welcome-subtitle">
            여행을 시작하기 전에 닉네임을 설정해주세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="nickname-form">
          <div className="input-group">
            <label htmlFor="nickname" className="input-label">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="사용하실 닉네임을 입력해주세요"
              className={`nickname-input ${error ? "error" : ""}`}
              maxLength={10}
              disabled={isSubmitting}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
            <div className="character-count">{nickname.length}/10</div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!nickname.trim() || !!error || isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                설정 중...
              </div>
            ) : (
              "시작하기"
            )}
          </button>
        </form>

        {/* 안내 메시지 */}
        <div className="nickname-info">
          <div className="info-item">
            <span className="info-text">
              닉네임은 언제든지 설정에서 변경할 수 있어요
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
