import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEnabledWebPagesByLocation } from "@/api/webpage.api";

interface WebPage {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  enabled: boolean;
  subInfo: string;
  order: number;
  location: "nav" | "footer" | "both";
}

export default function Footer() {
  const [webPages, setWebPages] = useState<WebPage[]>([]);

  useEffect(() => {
    const loadWebPages = async () => {
      try {
        const pages = await getEnabledWebPagesByLocation("footer");
        setWebPages(pages);
      } catch (error) {
        console.error("Failed to load web pages:", error);
      }
    };
    loadWebPages();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="flex flex-col space-y-4">
            <span className="text-white font-serif text-xl font-semibold">VERES</span>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} VERES. All Rights Reserved.</p>
          </div>

          {/* Web Pages from backend */}
          {webPages.length > 0 && (
            <div className="flex flex-col space-y-2 text-sm">
              {webPages.map((page) => (
                <Link
                  key={page._id}
                  to={page.slug}
                  className="text-gray-300 hover:underline"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          )}

          {/* Column 3 */}
          <div className="flex flex-col space-y-2 text-sm">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Handmade Soap</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Scented Candle</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Perfume</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Accessories</a>
          </div>

          {/* Column 4: small images / gallery */}
          <div className="grid grid-cols-4 gap-2">
            <img src="https://scontent-mct1-1.xx.fbcdn.net/v/t39.30808-6/558917834_1382352737233671_6437995612877157493_n.jpg?_nc_cat=111&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFd5qPSj5FLfEEb-OigKCp0yLzcA9jjkGbIvNwD2OOQZiSVdK9a0BO1fJflRjyJtGL2YCZ5uJCaJNmSAcuTlHDY&_nc_ohc=ekWgr6U3DhkQ7kNvwFAW1EL&_nc_oc=AdkVFeDV3lcusogvl0Nxn4ud0fYPsxb964VAHKDzMOia3HQ69O25lzJTLuTsD7ume1M&_nc_zt=23&_nc_ht=scontent-mct1-1.xx&_nc_gid=HeTVqwIJA-idFTx4uv38sw&oh=00_AfkIa0SzmSyiwHOzM_GO3SY84IWwGTB03rudOE2Ady_JNw&oe=6948B994" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-2.xx.fbcdn.net/v/t39.30808-6/557776163_1382025767266368_8538480003063942290_n.jpg?_nc_cat=102&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEVDvA39FLTPyOnM3ZjAQ6M_UUKEWc0lLP9RQoRZzSUs0jXZ0zvgIEds7MSgM1q0V56P8tSuo6-3uD0ChtXSpfP&_nc_ohc=gABexAFj-JgQ7kNvwGGHlai&_nc_oc=AdmUEWPBTZR5F1ha-H4GoEq87M8Hp72OZvj4HevVceD9OuDbjdrsTzKbKaggzSLIE_Q&_nc_zt=23&_nc_ht=scontent-mct1-2.xx&_nc_gid=bJ1-e7aeFV5aTBxsKuyn1g&oh=00_Afm5NY2MFc4iqdAAGFnxmi2i5SUDE4V89XJ2EFO5M001mQ&oe=6948DAAF" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-1.xx.fbcdn.net/v/t39.30808-6/557598978_1380241264111485_9116703325008662989_n.jpg?_nc_cat=110&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHSiZtjT8HkWOnzpTLq0VS4n_k6SYbrwPif-TpJhuvA-ApeVeMVeS6fPzWUeoO6KfPgVHh2Kjbr9OzFs8Ghq2pR&_nc_ohc=FGQ7JYqBZyYQ7kNvwHRM1OH&_nc_oc=AdmoeuNW1KR2oYokdXuhLOhdyGQxsenLyDZ5qtvH3iVTKmibvVB94Psu_5w6k9gn2YM&_nc_zt=23&_nc_ht=scontent-mct1-1.xx&_nc_gid=CIGK4kvVF4UPBBK7m-50gg&oh=00_AfnCrfl55t-2Djn05Qyc-w8HQ03YT1paGvXTyIVoQYX1Hg&oe=6948C8DB" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-1.xx.fbcdn.net/v/t39.30808-6/557160409_1378705897598355_1633957758158922430_n.jpg?_nc_cat=108&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG1YvKFQEhCY3vxn-mQssCSqnEqcTxrpyqqcSpxPGunKuBNhIqyyQMj1sGHu2gVVc5dEFcX5sCffqBfztDdwu5z&_nc_ohc=eVluoc313jwQ7kNvwG2ig0o&_nc_oc=AdnQ093ejsWUvFnLZnLeNGuQ4ONRuph3HPPdM3kIYineY6ouc0YRCcIL4Y50xpjeluQ&_nc_zt=23&_nc_ht=scontent-mct1-1.xx&_nc_gid=5GehRjxZrIBV5ciHVxBytg&oh=00_AfkfRkfAdx2K6ABsdDmBopCDaUYOsc7mhd9i5pe8_q7TFA&oe=6948CA1A" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-1.xx.fbcdn.net/v/t39.30808-6/548114476_1367225372079741_1358009045350879740_n.jpg?_nc_cat=106&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHeV3wduTrUWjdIQXNrjRMZfn26RAc6-t9-fbpEBzr631rwKxQcifABAILQSFT6U9rPNKmaI4KVP4MWiQRySYQT&_nc_ohc=Bc8TNlpeBuwQ7kNvwG5fxfZ&_nc_oc=AdnLbvKBNQWAhrJlT8r59ZjnisUvGUgKw1GS7cQGUGaRwbsFYiIDCX7gW9_eT9BfMt0&_nc_zt=23&_nc_ht=scontent-mct1-1.xx&_nc_gid=1YZBF6tcocek702fe75fmg&oh=00_Afk1U1mTCLa9GFptfohN-AhFAUKEibXCcGtk-OF3Zi5lBw&oe=6948D264" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-2.xx.fbcdn.net/v/t39.30808-6/546386467_1362494169219528_4763998387670738618_n.jpg?_nc_cat=103&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFkfHpSKWTktYiZqq-j_VVLLzYDp3rFkYQvNgOnesWRhJ2h3XofAVBCFifyEoIYAgAGy4kif4-tX1jv6-wSJB-b&_nc_ohc=uVEQGfeV380Q7kNvwFkUCRu&_nc_oc=Adn9GZqrohHajnesTLpsUsfxYmxDQf69ZRFZnGQAL3IYCv4fDYCjtSbJ6k_mKIgGeg0&_nc_zt=23&_nc_ht=scontent-mct1-2.xx&_nc_gid=QclfIXBaCa7IGon3qE82SQ&oh=00_AfkyNWO_8Y30TaKsEDYfn3W_TrobkvUvK-tGIzQOeXzBdA&oe=6948C384" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-1.xx.fbcdn.net/v/t39.30808-6/540012552_1349045513897727_4913784806623662149_n.jpg?_nc_cat=108&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEA8tXCLvJJuGL3UpDC8mlP3jzO8n5vEI3ePM7yfm8QjdT3pWZ7XLhMFbjoo2WAgmXOa8ZVf_z4ylzbWgkuKrMp&_nc_ohc=HOy0-EP6RVwQ7kNvwFHHNXJ&_nc_oc=AdmPe7xW95SKhajAo_2CxHFUs0sh6iBTaRf6K7FoEUqtDvosIiyWmvA8GuixtPOa3Nc&_nc_zt=23&_nc_ht=scontent-mct1-1.xx&_nc_gid=VgLu_68rY_6si11AYgRVfg&oh=00_Afm7kcoyJVNl8K5P7xhg_xhMQ9JYj2Eg0EgkS7xOfbZBzg&oe=6948BAA6" className="w-12 h-12 object-cover rounded" />
            <img src="https://scontent-mct1-2.xx.fbcdn.net/v/t39.30808-6/536282447_1345710417564570_3457195416088563138_n.jpg?_nc_cat=102&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG3QsBQxusRMw4hzmpRI6fNgtSBbtKAbRmC1IFu0oBtGWUAeJbQWaVTjiGYj2Iu2P3b8n2x8uCpeuLW18Vd4Vwg&_nc_ohc=CUIr0GmODMcQ7kNvwFKFlBr&_nc_oc=AdnJzR6EYJi5UxAkeFygSKGKJUVyoqFp70L4_2KY_HvsSyWsfRoPF6OBtlMqAlrVfRs&_nc_zt=23&_nc_ht=scontent-mct1-2.xx&_nc_gid=S4MsgBDCZEjgdvcRlnMPew&oh=00_AfnB2ohj-GOAEsV6bLNEEGix5qoYH1J4ePIoI-axQNl8EQ&oe=6948C762" className="w-12 h-12 object-cover rounded" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <span>© {new Date().getFullYear()} VERES. All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
