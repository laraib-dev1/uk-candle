import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div {...props} className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div {...props} className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
