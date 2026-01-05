import React from "react";

interface CircularLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CircularLoader({ 
  size = 20, 
  color = "currentColor",
  className = "" 
}: CircularLoaderProps) {
  const borderWidth = Math.max(2, Math.floor(size / 10));
  
  return (
    <span 
      className={`inline-block animate-spin ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid',
        borderColor: color,
        borderTopColor: 'transparent',
        borderRadius: '50%',
      }}
    />
  );
}

