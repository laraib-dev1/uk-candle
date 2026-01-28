import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareOptionsProps {
  url: string;
  title: string;
  showAsPopup?: boolean;
  variant?: "inline" | "sidebar";
  className?: string;
}

export default function ShareOptions({
  url,
  title,
  showAsPopup = false,
  variant = "inline",
  className = "",
}: ShareOptionsProps) {
  const [shareUrl, setShareUrl] = useState(url);
  const [shareTitle, setShareTitle] = useState(title);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Update share URL and title when props change
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always use current page URL if url prop is empty or invalid
      const currentUrl = url && url.trim() !== "" ? url : window.location.href;
      setShareUrl(currentUrl);
      // Use blog title if available, otherwise use document title
      const currentTitle = title && title.trim() !== "" ? title : document.title;
      setShareTitle(currentTitle);
    }
  }, [url, title]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        if (showAsPopup) {
          setIsPopupOpen(false);
        }
      } catch (err) {
        // User cancelled or error occurred
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }
  };

  const handleShareClick = (platform: string, shareLink: string) => {
    // Open share link in new window
    window.open(shareLink, "_blank", "noopener,noreferrer");
    if (showAsPopup) {
      setIsPopupOpen(false);
    }
  };

  // Inline share options (for main content area)
  const InlineShareOptions = () => (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <button
        onClick={(e) => handleShareClick("facebook", socialLinks.facebook, e)}
        className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors cursor-pointer"
        title="Share on Facebook"
        aria-label="Share on Facebook"
        type="button"
      >
        <Facebook size={20} />
      </button>
      <button
        onClick={(e) => handleShareClick("twitter", socialLinks.twitter, e)}
        className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors cursor-pointer"
        title="Share on Twitter"
        aria-label="Share on Twitter"
        type="button"
      >
        <Twitter size={20} />
      </button>
      <button
        onClick={(e) => handleShareClick("linkedin", socialLinks.linkedin, e)}
        className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#006399] transition-colors cursor-pointer"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
        type="button"
      >
        <Linkedin size={20} />
      </button>
      <button
        onClick={(e) => handleShareClick("pinterest", socialLinks.pinterest, e)}
        className="w-10 h-10 rounded-full bg-[#BD081C] text-white flex items-center justify-center hover:bg-[#A00718] transition-colors cursor-pointer"
        title="Share on Pinterest"
        aria-label="Share on Pinterest"
        type="button"
      >
        <FaPinterest size={20} />
      </button>
      {typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
          title="Share"
          aria-label="Share via native share"
          type="button"
        >
          <Share2 size={20} />
        </button>
      )}
    </div>
  );

  // Sidebar share options (vertical list)
  const SidebarShareOptions = () => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={() => handleShareClick("facebook", socialLinks.facebook)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors text-sm"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
        Facebook
      </button>
      <button
        onClick={() => handleShareClick("twitter", socialLinks.twitter)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1A91DA] transition-colors text-sm"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} />
        Twitter
      </button>
      <button
        onClick={() => handleShareClick("linkedin", socialLinks.linkedin)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0077B5] text-white hover:bg-[#006399] transition-colors text-sm"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
        LinkedIn
      </button>
      <button
        onClick={() => handleShareClick("pinterest", socialLinks.pinterest)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#BD081C] text-white hover:bg-[#A00718] transition-colors text-sm"
        aria-label="Share on Pinterest"
      >
        <FaPinterest size={16} />
        Pinterest
      </button>
      {typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm"
          aria-label="Share via native share"
        >
          <Share2 size={16} />
          Share
        </button>
      )}
    </div>
  );

  // Popup share options
  const PopupShareOptions = () => (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsPopupOpen(true);
        }}
        className={`w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer ${className}`}
        title="Share"
        aria-label="Open share options"
        type="button"
      >
        <Share2 size={20} />
      </button>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Love!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <button
              onClick={(e) => handleShareClick("facebook", socialLinks.facebook, e)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors cursor-pointer"
              aria-label="Share on Facebook"
              type="button"
            >
              <Facebook size={20} />
              <span>Share on Facebook</span>
            </button>
            <button
              onClick={(e) => handleShareClick("twitter", socialLinks.twitter, e)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1A91DA] transition-colors cursor-pointer"
              aria-label="Share on Twitter"
              type="button"
            >
              <Twitter size={20} />
              <span>Share on Twitter</span>
            </button>
            <button
              onClick={(e) => handleShareClick("linkedin", socialLinks.linkedin, e)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0077B5] text-white hover:bg-[#006399] transition-colors cursor-pointer"
              aria-label="Share on LinkedIn"
              type="button"
            >
              <Linkedin size={20} />
              <span>Share on LinkedIn</span>
            </button>
            <button
              onClick={(e) => handleShareClick("pinterest", socialLinks.pinterest, e)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#BD081C] text-white hover:bg-[#A00718] transition-colors cursor-pointer"
              aria-label="Share on Pinterest"
              type="button"
            >
              <FaPinterest size={20} />
              <span>Share on Pinterest</span>
            </button>
            {typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="Share via native share"
                type="button"
              >
                <Share2 size={20} />
                <span>Share via...</span>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  if (showAsPopup) {
    return <PopupShareOptions />;
  }

  // Return sidebar or inline based on variant
  if (variant === "sidebar") {
    return <SidebarShareOptions />;
  }

  // Default: return inline options
  return <InlineShareOptions />;
}

// Export sidebar version as separate component
export function ShareOptionsSidebar({
  url,
  title,
  className = "",
}: Omit<ShareOptionsProps, "showAsPopup" | "variant">) {
  return <ShareOptions url={url} title={title} variant="sidebar" className={className} />;
}
