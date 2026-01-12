import API from "./axios";

// We sometimes get relative URLs ("/uploads/..."), so we expand them to full URLs
// using the same BASE_URL logic as products.
const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export type BannerSlot =
  | "hero-main" // big hero banner for Landing page
  | "hero-secondary" // second banner on Landing page
  | "hero-tertiary" // third banner on Landing page
  | "hero-last" // last banner on Landing page (above feedback section)
  | "shop-main"; // banner at the top of Shop page

export interface Banner {
  _id: string;
  slot: BannerSlot | string;
  imageUrl: string;
  targetUrl: string;
  updatedAt?: string;
}

const mapImage = (b: any): Banner => {
  const getFull = (img: string | null) => {
    if (!img || img.trim() === "") return "";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  return {
    _id: b._id,
    slot: b.slot,
    imageUrl: getFull(b.imageUrl),
    targetUrl: b.targetUrl || "",
    updatedAt: b.updatedAt,
  };
};

// -------- PUBLIC: Get all banners (used on Landing / Shop pages) --------
export const getBanners = async (): Promise<Banner[]> => {
  const res = await API.get("/banners");
  return (res.data.data || []).map(mapImage);
};

// -------- ADMIN: Update one banner slot --------
export const updateBanner = async (
  slot: BannerSlot | string,
  options: { targetUrl: string; file?: File | null }
): Promise<Banner> => {
  const form = new FormData();
  form.append("targetUrl", options.targetUrl || "");
  if (options.file) {
    form.append("image", options.file);
  }

  const res = await API.put(`/banners/${slot}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapImage(res.data.data);
};


















