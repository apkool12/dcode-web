// 알림 데이터 타입
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "warning" | "success";
}

// 로컬스토리지 키
const NOTIFICATIONS_KEY = "dcode_notifications";

// 기본 알림 데이터
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "목적지 도착 알림",
    message: "대전역에 도착했습니다. 다음 목적지로 이동하세요.",
    time: "2분 전",
    isRead: false,
    type: "info",
  },
  {
    id: "2",
    title: "새로운 추천 경로",
    message: "현재 위치 기반으로 새로운 추천 경로가 있습니다.",
    time: "10분 전",
    isRead: false,
    type: "success",
  },
  {
    id: "3",
    title: "날씨 알림",
    message: "오늘 오후에 비가 올 예정입니다. 우산을 챙기세요.",
    time: "1시간 전",
    isRead: true,
    type: "warning",
  },
  {
    id: "4",
    title: "D-CODE 업데이트",
    message: "새로운 기능이 추가되었습니다. 확인해보세요!",
    time: "2시간 전",
    isRead: true,
    type: "info",
  },
];

// 알림 목록 불러오기
export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
  } catch (error) {
    console.error("알림 불러오기 실패:", error);
    return DEFAULT_NOTIFICATIONS;
  }
};

// 알림 목록 저장
export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("알림 저장 실패:", error);
  }
};

// 읽지 않은 알림 개수 계산
export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter((n) => !n.isRead).length;
};

// 알림을 읽음으로 표시
export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map((notification) =>
    notification.id === id ? { ...notification, isRead: true } : notification
  );
  saveNotifications(updated);
};

// 모든 알림을 읽음으로 표시
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updated = notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
  saveNotifications(updated);
};

// 알림 삭제
export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.filter(
    (notification) => notification.id !== id
  );
  saveNotifications(updated);
};

// 새 알림 추가
export const addNotification = (
  notification: Omit<Notification, "id">
): void => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
  };
  const updated = [newNotification, ...notifications];
  saveNotifications(updated);
};

// 알림 초기화 (처음 앱 실행 시)
export const initializeNotifications = (): void => {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!stored) {
    saveNotifications(DEFAULT_NOTIFICATIONS);
  }
};



