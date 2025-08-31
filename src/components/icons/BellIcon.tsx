import React from "react";

interface BellIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const BellIcon: React.FC<BellIconProps> = ({
  width = 24,
  height = 24,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C13.1 2 14 2.9 14 4V4.29C17.03 5.15 19 7.82 19 11V17L21 19V20H3V19L5 17V11C5 7.82 6.97 5.15 10 4.29V4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default BellIcon;
