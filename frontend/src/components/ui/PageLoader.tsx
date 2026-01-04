import React from "react";
import "./PageLoader.css";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "GraceByAnu" }: PageLoaderProps) {
  // Split message into individual letters
  const letters = message.split("");

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="loader-wrapper">
        <div className="loader"></div>
        <div className="loader-text">
          {letters.map((letter, index) => (
            <span key={index} className="loader-letter">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
