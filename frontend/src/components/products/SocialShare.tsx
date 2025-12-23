import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

interface SocialShareProps {
  productName: string;
  productUrl: string;
  productImage?: string;
  productDescription?: string;
}

export default function SocialShare({
  productName,
  productUrl,
  productImage,
  productDescription,
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedTitle = encodeURIComponent(productName);
  const encodedDesc = encodeURIComponent(productDescription || "");

  // Facebook share URL with OG image
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // WhatsApp share text + URL
  const whatsappShare = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const iconColor = "white";
  const iconSize = 20;

  const sharedClass =
    "flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 hover:opacity-80";

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: productName,
          text: productDescription,
          url: productUrl,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      // Browser doesn't support sharing - this is handled by the UI (button won't show)
    }
  };

  // Instagram share (opens Instagram app or web)
  const instagramShare = `https://www.instagram.com/`;
  
  // TikTok share
  const tiktokShare = `https://www.tiktok.com/`;

  return (
    <div>
      <span className="text-sm text-gray-700 mb-3 block">Share this on social media</span>
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <a
          href={facebookShare}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary)";
          }}
        >
          <FaFacebookF size={iconSize} color={iconColor} />
        </a>

        {/* Instagram */}
        <a
          href={instagramShare}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary)";
          }}
        >
          <FaInstagram size={iconSize} color={iconColor} />
        </a>

        {/* TikTok */}
        <a
          href={tiktokShare}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary)";
          }}
        >
          <FaTiktok size={iconSize} color={iconColor} />
        </a>
      </div>
    </div>
  );
}









// import React from "react";
// import { FaFacebookF, FaInstagram, FaWhatsapp, FaShareAlt } from "react-icons/fa";

// export default function SocialShare() {
//   const url = encodeURIComponent(window.location.href);
//   const title = encodeURIComponent("Check out this product!");

//   const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
//   const whatsappShare = `https://wa.me/?text=${title}%20${url}`;
//   const instagramMessage = `https://www.instagram.com`;

//   const iconColor = "white"; // icon inside circle
//   const circleBgColor = "#b88b5f"; // background of the circle
//   const iconSize = 20; // icon size inside the circle

//   const sharedClass =
//     "flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 hover:opacity-80";

//   return (
//     <div className="mt-6">
//       <span className="font-semibold block mb-2">Share this on social media</span>

//       <div className="flex items-center gap-4 mt-2">

//         {/* Facebook */}
//         <a
//           href={facebookShare}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={`${sharedClass}`}
//           style={{ backgroundColor: circleBgColor }}
//         >
//           <FaFacebookF size={iconSize} color={iconColor} />
//         </a>

//         {/* WhatsApp */}
//         <a
//           href={whatsappShare}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={`${sharedClass}`}
//           style={{ backgroundColor: circleBgColor }}
//         >
//           <FaWhatsapp size={iconSize} color={iconColor} />
//         </a>

//         {/* Instagram */}
//         <a
//           href={instagramMessage}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={`${sharedClass}`}
//           style={{ backgroundColor: circleBgColor }}
//         >
//           <FaInstagram size={iconSize} color={iconColor} />
//         </a>

//         {/* Native Share */}
//         <button
//           onClick={() => navigator.share?.({ title: "Product", url: window.location.href })}
//           className={`${sharedClass}`}
//           style={{ backgroundColor: circleBgColor }}
//         >
//           <FaShareAlt size={iconSize} color={iconColor} />
//         </button>

//       </div>
//     </div>
//   );
// }
