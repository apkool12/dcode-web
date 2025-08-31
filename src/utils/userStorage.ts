// 로컬스토리지 키 상수
const STORAGE_KEYS = {
  USER_NICKNAME: "dcode_user_nickname",
  FIRST_VISIT: "dcode_first_visit",
  USER_EMAIL: "dcode_user_email",
  USER_SETTINGS: "dcode_user_settings",
} as const;

// 사용자 정보 인터페이스
export interface UserInfo {
  nickname: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

// 사용자 설정 인터페이스
export interface UserSettings {
  notifications: boolean;
  location: boolean;
  theme: "light" | "dark";
  language: "ko" | "en";
}

// 기본 설정값
const DEFAULT_SETTINGS: UserSettings = {
  notifications: true,
  location: true,
  theme: "light",
  language: "ko",
};

// 닉네임 저장
export const saveNickname = (nickname: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_NICKNAME, nickname);

    // 첫 방문 완료 표시
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, "false");

    // 사용자 생성 시간 저장 (처음 닉네임 설정 시에만)
    const existingUserInfo = getUserInfo();
    if (!existingUserInfo) {
      const now = new Date().toISOString();
      const userInfo: UserInfo = {
        nickname,
        email: "user@example.com", // 기본값
        createdAt: now,
        lastLoginAt: now,
      };
      localStorage.setItem("dcode_user_info", JSON.stringify(userInfo));
    } else {
      // 기존 사용자의 닉네임만 업데이트
      const updatedInfo = {
        ...existingUserInfo,
        nickname,
        lastLoginAt: new Date().toISOString(),
      };
      localStorage.setItem("dcode_user_info", JSON.stringify(updatedInfo));
    }

    console.log("닉네임이 저장되었습니다:", nickname);
  } catch (error) {
    console.error("닉네임 저장 실패:", error);
  }
};

// 닉네임 불러오기
export const getNickname = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_NICKNAME);
  } catch (error) {
    console.error("닉네임 불러오기 실패:", error);
    return null;
  }
};

// 첫 방문 여부 확인
export const isFirstVisit = (): boolean => {
  try {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    return firstVisit === null || firstVisit === "true";
  } catch (error) {
    console.error("첫 방문 여부 확인 실패:", error);
    return true; // 에러 시 첫 방문으로 간주
  }
};

// 사용자 정보 불러오기
export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfo = localStorage.getItem("dcode_user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("사용자 정보 불러오기 실패:", error);
    return null;
  }
};

// 사용자 설정 저장
export const saveUserSettings = (settings: Partial<UserSettings>): void => {
  try {
    const currentSettings = getUserSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(
      STORAGE_KEYS.USER_SETTINGS,
      JSON.stringify(updatedSettings)
    );
    console.log("사용자 설정이 저장되었습니다:", updatedSettings);
  } catch (error) {
    console.error("사용자 설정 저장 실패:", error);
  }
};

// 사용자 설정 불러오기
export const getUserSettings = (): UserSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return settings
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) }
      : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("사용자 설정 불러오기 실패:", error);
    return DEFAULT_SETTINGS;
  }
};

// 이메일 저장
export const saveEmail = (email: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);

    // 사용자 정보 업데이트
    const userInfo = getUserInfo();
    if (userInfo) {
      const updatedInfo = {
        ...userInfo,
        email,
        lastLoginAt: new Date().toISOString(),
      };
      localStorage.setItem("dcode_user_info", JSON.stringify(updatedInfo));
    }

    console.log("이메일이 저장되었습니다:", email);
  } catch (error) {
    console.error("이메일 저장 실패:", error);
  }
};

// 이메일 불러오기
export const getEmail = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
  } catch (error) {
    console.error("이메일 불러오기 실패:", error);
    return null;
  }
};

// 모든 사용자 데이터 삭제 (로그아웃)
export const clearUserData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem("dcode_user_info");
    console.log("모든 사용자 데이터가 삭제되었습니다.");
  } catch (error) {
    console.error("사용자 데이터 삭제 실패:", error);
  }
};

// 사용자 데이터 내보내기 (백업용)
export const exportUserData = (): string => {
  try {
    const userData = {
      nickname: getNickname(),
      email: getEmail(),
      userInfo: getUserInfo(),
      settings: getUserSettings(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(userData, null, 2);
  } catch (error) {
    console.error("사용자 데이터 내보내기 실패:", error);
    return "{}";
  }
};

// 마지막 로그인 시간 업데이트
export const updateLastLogin = (): void => {
  try {
    const userInfo = getUserInfo();
    if (userInfo) {
      const updatedInfo = {
        ...userInfo,
        lastLoginAt: new Date().toISOString(),
      };
      localStorage.setItem("dcode_user_info", JSON.stringify(updatedInfo));
    }
  } catch (error) {
    console.error("마지막 로그인 시간 업데이트 실패:", error);
  }
};



