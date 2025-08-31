import React from "react";
import "./LocationCard.css";
import LockIcon from "../icons/LockIcon";
import TalkIcon from "../icons/TalkIcon";
import PuzzleIcon from "../icons/PuzzleIcon";

export interface LocationCardProps {
  name: string;
  status: {
    text: string;
    icon?: React.ReactNode;
    type?: "current" | "distance" | "custom";
  };
  tags: Array<{
    type: "conversation" | "puzzle" | "walking";
    text: string;
  }>;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
  distance?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  status,
  tags,
  isLocked = false,
  onClick,
  className = "",
  distance,
}) => {
  const renderStatusIcon = () => {
    if (status.icon) return status.icon;

    switch (status.type) {
      case "current":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              fill="#674ab9"
              stroke="#674ab9"
              strokeWidth="2"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "distance":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              fill="white"
              stroke="#674ab9"
              strokeWidth="2"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTagIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <TalkIcon size={12} />;
      case "puzzle":
        return <PuzzleIcon size={12} />;
      case "walking":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 4V2L8 7L13 12V10C16.39 10.56 19 13.58 19 17.5V19H21V17.5C21 13.46 18.64 10.03 15.28 8.67L13.83 9.35C14.19 9.13 14.5 8.79 14.79 8.45L13 4Z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`location-card-container ${className}`} onClick={onClick}>
      <div className="location-card">
        {isLocked ? (
          <LockIcon size={32} color="#ffffff" />
        ) : (
          <div className="location-card-content">
            {/* 여기에 다른 아이콘이나 내용을 넣을 수 있습니다 */}
          </div>
        )}
      </div>
      <div className="location-info">
        <div className="location-name">{name}</div>
        <div className="location-status">
          {renderStatusIcon()}
          <span className="status-text">{status.text}</span>
        </div>
        <div className="location-tags">
          {tags.map((tag, index) => (
            <span key={index} className={`tag ${tag.type}`}>
              {renderTagIcon(tag.type)}
              {tag.text}
            </span>
          ))}
        </div>
      </div>
      {distance && <div className="location-distance">{distance}</div>}
    </div>
  );
};

export default LocationCard;
