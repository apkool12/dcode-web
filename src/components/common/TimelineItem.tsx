import React, { useRef, useEffect, useState } from "react";
import "./TimelineItem.css";

export interface TimelineItemProps {
  type: "start" | "destination" | "end";
  label?: string;
  children: React.ReactNode;
  className?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  type,
  label,
  children,
  className = "",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(contentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (labelRef.current && contentHeight > 0) {
      // 라벨을 컨텐츠 중앙에 위치시킴
      const labelTop = (contentHeight - labelRef.current.offsetHeight) / 2;
      labelRef.current.style.top = `${labelTop}px`;
    }

    if (dotRef.current && contentHeight > 0) {
      // dot을 컨텐츠 중앙에 위치시킴
      const dotTop = (contentHeight - dotRef.current.offsetHeight) / 2;
      dotRef.current.style.top = `${dotTop}px`;
    }
  }, [contentHeight]);

  return (
    <div className={`timeline-item ${type}-item ${className}`}>
      {label && (
        <div ref={labelRef} className="timeline-label">
          {label}
        </div>
      )}
      {type === "destination" && (
        <div ref={dotRef} className="timeline-dot"></div>
      )}
      <div ref={contentRef} className="timeline-content">
        {children}
      </div>
    </div>
  );
};

export default TimelineItem;
