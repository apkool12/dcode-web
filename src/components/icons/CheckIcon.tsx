import React from "react";

interface CheckIconProps {
  size?: number;
  className?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({ size = 20, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* 보라색 배경 사각형 */}
      <rect width="20" height="20" rx="4" fill="#674ab9" />
      {/* 흰색 체크마크 */}
      <path
        d="M7 10L9 12L13 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
