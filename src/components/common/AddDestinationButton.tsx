import React from "react";
import "./AddDestinationButton.css";

export interface AddDestinationButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

const AddDestinationButton: React.FC<AddDestinationButtonProps> = ({
  onClick,
  text = "목적지 설정",
  className = "",
}) => {
  return (
    <div className={`add-destination-container ${className}`}>
      <button className="add-destination-btn" onClick={onClick}>
        <span className="plus-icon">+</span>
      </button>
      <div className="destination-text">{text}</div>
    </div>
  );
};

export default AddDestinationButton;
