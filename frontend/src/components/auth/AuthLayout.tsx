import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{
        backgroundImage: `url('/download.jpeg')`,
      }}
    >
      <div className="backdrop-blur-xl bg-white/10 shadow-xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-[900px]">
        
        {/* Left Logo Box */}
        <div className="hidden md:flex w-[200px] h-[200px] rounded-full bg-white/20 items-center justify-center backdrop-blur-md">
          <img src="/logo.png"  alt="Logo" className="w-full h-full object-contain" />
        </div>

        {/* Vertical line */}
        <div className="hidden md:block h-[200px] w-1px bg-white/20" />

        {/* Right Content */}
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
