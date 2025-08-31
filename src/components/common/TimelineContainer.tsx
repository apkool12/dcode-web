import React from "react";
import "./TimelineContainer.css";

export interface TimelineContainerProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineContainer: React.FC<TimelineContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={`timeline-container ${className}`}>{children}</div>;
};

export default TimelineContainer;
