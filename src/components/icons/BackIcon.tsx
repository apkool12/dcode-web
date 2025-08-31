import React from "react";

interface BackIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const BackIcon: React.FC<BackIconProps> = ({
  width = 12,
  height = 24,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 19.438L8.95502 20.5L1.28902 12.71C1.10452 12.5197 1.00134 12.2651 1.00134 12C1.00134 11.7349 1.10452 11.4803 1.28902 11.29L8.95502 3.5L10 4.563L2.68202 12L10 19.438Z"
        fill="#674AB9"
      />
    </svg>
  );
};

export default BackIcon;
