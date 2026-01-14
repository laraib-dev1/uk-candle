import React from "react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

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

  // Facebook share URL - Facebook uses OG tags from the page, so just pass the URL
  // The image will come from og:image meta tag
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // WhatsApp share with text and URL
  const whatsappShare = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const iconColor = "white";
  const iconSize = 20;

  const sharedClass =
    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110";

  return (
    <div className="mt-4">
      <span className="text-sm text-gray-700 mb-3 block">Share this on social media</span>
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <a
          href={facebookShare}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark, #6B4A2C)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary, #8B5E3C)";
          }}
          title="Share on Facebook"
        >
          <FaFacebookF size={iconSize} color={iconColor} />
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappShare}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary, #8B5E3C)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark, #6B4A2C)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary, #8B5E3C)";
          }}
          title="Share on WhatsApp"
        >
          <FaWhatsapp size={iconSize} color={iconColor} />
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
