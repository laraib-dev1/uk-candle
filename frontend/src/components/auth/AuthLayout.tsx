import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url('/images/bg-blur.jpg')`, // replace with your image
      }}
    >
      <div className="backdrop-blur-xl bg-white/10 shadow-xl rounded-2xl p-10 flex items-center gap-10 w-[900px] max-w-[95%]">
        
        {/* Left Logo Box */}
        <div className="w-[200px] h-[200px] rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
          <img src="/images/logo.png" alt="Logo" className="w-20 opacity-90" />
        </div>

        {/* Vertical line */}
        <div className="h-[200px] w-[1px] bg-white/20" />

        {/* Right Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
