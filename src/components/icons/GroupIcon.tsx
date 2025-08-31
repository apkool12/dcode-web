import React from "react";

interface GroupIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const GroupIcon: React.FC<GroupIconProps> = ({
  width = 55,
  height = 45,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 55 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.125 15.9375C9.125 15.9375 2.37481 18.5625 1.25 27.75M45.875 15.9375C45.875 15.9375 52.6252 18.5625 53.75 27.75M19.625 15.9375C19.625 15.9375 25.925 17.4692 27.5 25.125C29.075 17.4692 35.375 15.9375 35.375 15.9375M22.25 35.625C22.25 35.625 16.7375 36.6094 14.375 43.5M32.75 35.625C32.75 35.625 38.2625 36.6094 40.625 43.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.5 38.25C31.1244 38.25 34.0625 35.3119 34.0625 31.6875C34.0625 28.0631 31.1244 25.125 27.5 25.125C23.8756 25.125 20.9375 28.0631 20.9375 31.6875C20.9375 35.3119 23.8756 38.25 27.5 38.25Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.625 17.25C44.9742 17.25 48.5 13.7242 48.5 9.375C48.5 5.02576 44.9742 1.5 40.625 1.5C36.2758 1.5 32.75 5.02576 32.75 9.375C32.75 13.7242 36.2758 17.25 40.625 17.25Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.375 17.25C18.7242 17.25 22.25 13.7242 22.25 9.375C22.25 5.02576 18.7242 1.5 14.375 1.5C10.0258 1.5 6.5 5.02576 6.5 9.375C6.5 13.7242 10.0258 17.25 14.375 17.25Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default GroupIcon;
