import React, { useState, useEffect } from "react";
import "./MenuModal.css";
import {
  getNickname,
  getEmail,
  getUserInfo,
  clearUserData,
} from "../utils/userStorage";

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose }) => {
  const [userNickname, setUserNickname] = useState<string>("사용자");
  const [userEmail, setUserEmail] = useState<string>("user@example.com");

  // 사용자 정보 불러오기
  useEffect(() => {
    if (visible) {
      const nickname = getNickname();
      const email = getEmail();
      const userInfo = getUserInfo();
      setUserNickname(nickname || "사용자");
      setUserEmail(email || userInfo?.email || "user@example.com");
    }
  }, [visible]);
  const menuItems = [
    {
      id: "profile",
      title: "프로필",
      description: "내 정보 관리",
      action: () => console.log("프로필 클릭"),
    },
    {
      id: "history",
      title: "여행 기록",
      description: "이전 여행 기록 보기",
      action: () => console.log("여행 기록 클릭"),
    },
    {
      id: "favorites",
      title: "즐겨찾기",
      description: "저장된 장소들",
      action: () => console.log("즐겨찾기 클릭"),
    },
    {
      id: "settings",
      title: "설정",
      description: "앱 설정 및 환경설정",
      action: () => console.log("설정 클릭"),
    },
    {
      id: "help",
      title: "도움말",
      description: "사용법 및 FAQ",
      action: () => console.log("도움말 클릭"),
    },
    {
      id: "about",
      title: "D-CODE 소개",
      description: "앱 정보 및 버전",
      action: () => console.log("D-CODE 소개 클릭"),
    },
    {
      id: "feedback",
      title: "피드백",
      description: "의견 보내기",
      action: () => console.log("피드백 클릭"),
    },
    {
      id: "logout",
      title: "로그아웃",
      description: "계정에서 로그아웃",
      action: () => handleLogout(),
      isDestructive: true,
    },
  ];

  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      clearUserData();
      window.location.reload(); // 페이지 새로고침으로 초기 상태로 돌아감
    }
  };

  const handleMenuItemClick = (item: any) => {
    item.action();
    if (item.id !== "logout") {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div
        className="menu-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="menu-modal-header">
          <div className="menu-title">메뉴</div>
          <button className="menu-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="user-info-section">
          <div className="user-details">
            <div className="user-name">{userNickname}님</div>
            <div className="user-email">{userEmail}</div>
          </div>
        </div>

        {/* 메뉴 목록 */}
        <div className="menu-list">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${item.isDestructive ? "destructive" : ""}`}
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="menu-item-content">
                <div className="menu-item-title">{item.title}</div>
                <div className="menu-item-description">{item.description}</div>
              </div>
              <div className="menu-item-arrow">›</div>
            </div>
          ))}
        </div>

        {/* 앱 버전 정보 */}
        <div className="app-version">
          <div className="version-text">D-CODE v1.0.0</div>
          <div className="version-subtext">© 2025 D-CODE Team</div>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
