import React, { useState, useEffect } from "react";
import "./NotificationModal.css";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification,
} from "../utils/notificationStorage";

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 데이터 로드
  const loadNotifications = () => {
    const notificationData = getNotifications();
    setNotifications(notificationData);

    // 읽지 않은 알림 개수 콜백 호출
    const unreadCount = notificationData.filter((n) => !n.isRead).length;
    onUnreadCountChange?.(unreadCount);
  };

  // 컴포넌트 마운트 시 및 모달이 열릴 때 알림 로드
  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications(); // 변경사항 반영
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications(); // 변경사항 반영
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    loadNotifications(); // 변경사항 반영
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!visible) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div
        className="notification-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="notification-modal-header">
          <div className="notification-title">
            알림
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notification-actions">
            <button
              className="notification-action-btn"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              모두 읽음
            </button>
            <button className="notification-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="empty-text">새로운 알림이 없습니다</div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="notification-title-text">
                      {notification.title}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                </div>
                <button
                  className="notification-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(notification.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* 설정 버튼 */}
        <div className="notification-settings">
          <button className="settings-btn">알림 설정</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
