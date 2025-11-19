import React from "react";
import { Facebook, Instagram, Share2 } from "lucide-react";

export default function SocialShare() {
  return (
    <div className="mt-6">
      {/* Title */}
      <span className="font-semibold block mb-2">
        Share this on social media
      </span>

      {/* Icons on next line */}
      <div className="flex items-center gap-4 mt-2">
        <a href="#" className="text-blue-600 hover:opacity-80">
          <Facebook size={22} />
        </a>

        <a href="#" className="text-pink-500 hover:opacity-80">
          <Instagram size={22} />
        </a>

        <a href="#" className="text-black hover:opacity-80">
          <Share2 size={22} />
        </a>
      </div>
    </div>
  );
}
