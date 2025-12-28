import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
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
  // Clean description for WhatsApp (remove HTML tags, limit length)
  const cleanDescription = (desc: string | undefined): string => {
    if (!desc) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = desc;
    let text = tempDiv.textContent || tempDiv.innerText || "";
    text = text.trim().replace(/\s+/g, " ");
    // Limit to 200 chars for WhatsApp
    if (text.length > 200) {
      text = text.substring(0, 197) + "...";
    }
    return text;
  };

  const cleanedDesc = cleanDescription(productDescription);
  
  // Debug: Log the data being used
  console.log("🔍 SocialShare Data:", {
    productName,
    productUrl,
    productDescription,
    cleanedDesc,
    productImage
  });
  
  // Encode URLs and text properly
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedTitle = encodeURIComponent(productName);
  const encodedDesc = encodeURIComponent(cleanedDesc);

  // Facebook share URL - Facebook will crawl the page and use OG tags
  // The OG tags are set in ProductDetail.tsx via React Helmet
  // For better crawler support, we can also use the OG endpoint: /api/products/:id/og
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Twitter/X share URL - includes text and URL
  const twitterText = cleanedDesc 
    ? `${productName} - ${cleanedDesc}`
    : productName;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(twitterText)}`;

  // WhatsApp share - formatted message with product name, description, and URL
  // Format: Product Name + Description + URL (all in one message)
  const whatsappMessage = cleanedDesc 
    ? `Check out this product: ${productName}\n\n${cleanedDesc}\n\nView here: ${productUrl}`
    : `Check out this product: ${productName}\n\nView here: ${productUrl}`;
  
  // Encode the full message for WhatsApp (wa.me format)
  // WhatsApp requires proper URL encoding
  const encodedWhatsAppMessage = encodeURIComponent(whatsappMessage);
  const whatsappShare = `https://wa.me/?text=${encodedWhatsAppMessage}`;
  
  // For WhatsApp Web (alternative for desktop) - use api.whatsapp.com for better compatibility
  const whatsappWebShare = `https://web.whatsapp.com/send?text=${encodedWhatsAppMessage}`;
  
  // Debug: Log the generated URLs
  console.log("🔗 Generated Share URLs:", {
    facebook: facebookShare,
    twitter: twitterShare,
    whatsapp: whatsappShare,
    whatsappWeb: whatsappWebShare,
    whatsappMessage: whatsappMessage,
    productName,
    productUrl,
    hasDescription: !!cleanedDesc
  });

  const iconColor = "white";
  const iconSize = 20;

  const sharedClass =
    "flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 hover:opacity-80";

  // Instagram - doesn't support direct sharing URLs, use native share or copy link
  const handleInstagramShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: cleanedDesc || productName,
        url: productUrl,
      }).catch((err) => console.error("Share failed:", err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(productUrl).then(() => {
        alert("Link copied! Paste it in Instagram.");
      }).catch(() => {
        prompt("Copy this link to share on Instagram:", productUrl);
      });
    }
  };
  
  // TikTok - doesn't support direct sharing URLs, use native share or copy link
  const handleTikTokShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: cleanedDesc || productName,
        url: productUrl,
      }).catch((err) => console.error("Share failed:", err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(productUrl).then(() => {
        alert("Link copied! Paste it in TikTok.");
      }).catch(() => {
        prompt("Copy this link to share on TikTok:", productUrl);
      });
    }
  };

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
          title="Share on Facebook"
          onClick={(e) => {
            console.log("📘 Facebook Share Clicked:", {
              url: facebookShare,
              productUrl: productUrl,
              productName: productName
            });
          }}
        >
          <FaFacebookF size={iconSize} color={iconColor} />
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappShare}
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
          title={`Share ${productName} on WhatsApp`}
          onClick={(e) => {
            console.log("📱 WhatsApp Share Clicked:", {
              isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
              whatsappShare,
              whatsappWebShare,
              message: whatsappMessage
            });
            
            // On desktop, use WhatsApp Web
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) {
              e.preventDefault();
              window.open(whatsappWebShare, '_blank', 'width=800,height=600');
            }
            // On mobile, let the default href handle it (wa.me will open app)
          }}
        >
          <FaWhatsapp size={iconSize} color={iconColor} />
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagramShare}
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary)", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary)";
          }}
          title="Share on Instagram"
        >
          <FaInstagram size={iconSize} color={iconColor} />
        </button>

        {/* TikTok */}
        <button
          onClick={handleTikTokShare}
          className={sharedClass}
          style={{ backgroundColor: "var(--theme-primary)", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--theme-primary)";
          }}
          title="Share on TikTok"
        >
          <FaTiktok size={iconSize} color={iconColor} />
        </button>
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
