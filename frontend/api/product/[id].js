// Vercel serverless function to inject meta tags for product pages
// This allows social media crawlers to see the meta tags

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of known social media crawlers
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'SkypeUriPreview',
  'Applebot',
  'Googlebot',
  'bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Sogou',
  'Exabot',
  'ia_archiver',
  'facebook',
  'twitter',
  'linkedin',
  'whatsapp',
];

function isCrawler(userAgent) {
  if (!userAgent) {
    // Some crawlers don't send user-agent, but we'll be conservative
    return false;
  }
  const ua = userAgent.toLowerCase();
  
  // Check against known crawler list
  const isKnownBot = CRAWLER_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
  
  // Also check for common bot patterns (but be careful not to catch regular browsers)
  const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'facebookexternalhit'];
  const hasBotPattern = botPatterns.some(pattern => ua.includes(pattern));
  
  // Exclude common browsers
  const isBrowser = ua.includes('chrome') || ua.includes('firefox') || ua.includes('safari') || ua.includes('edge') || ua.includes('opera');
  
  return (isKnownBot || hasBotPattern) && !isBrowser;
}

function getApiUrl() {
  // In Vercel, use the backend URL from environment
  // VITE_API_URLS format: "http://localhost:5000/api,https://your-backend.vercel.app/api"
  const urls = (process.env.VITE_API_URLS || process.env.API_URL || '').split(',').map(u => u.trim()).filter(Boolean);
  
  // In production (Vercel), use the second URL (Vercel backend), otherwise first (local)
  if (process.env.VERCEL) {
    if (urls.length > 1) {
      return urls[1];
    }
    // Fallback: try to construct from common pattern
    return process.env.VITE_API_URL || process.env.API_URL || 'https://uk-candles-backend.vercel.app/api';
  }
  return urls[0] || process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:5000/api';
}

async function fetchProductData(productId) {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

function getAbsoluteImageUrl(imageUrl, apiUrl) {
  // If no image, return default product image from frontend
  if (!imageUrl || imageUrl === '/product.png' || imageUrl.trim() === '') {
    const frontendUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://uk-candles.vercel.app';
    return `${frontendUrl}/product.png`;
  }
  
  // If already absolute URL (Cloudinary or full URL), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative URL, make it absolute using API base URL
  const baseUrl = apiUrl.replace('/api', '');
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }
  
  return `${baseUrl}/${imageUrl}`;
}

function cleanDescription(description, productName, companyName) {
  if (!description) {
    return `${productName} - Available at ${companyName}`;
  }
  
  // Remove HTML tags (simple regex, not perfect but works for most cases)
  let text = description.replace(/<[^>]*>/g, '');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  text = text.trim().replace(/\s+/g, ' ');
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }
  
  return text || `${productName} - Available at ${companyName}`;
}

async function fetchCompanyName() {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/company`);
    if (!response.ok) return 'Grace by Anu';
    const data = await response.json();
    return data.data?.company || 'Grace by Anu';
  } catch (error) {
    console.error('Error fetching company:', error);
    return 'Grace by Anu';
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const userAgent = req.headers['user-agent'] || '';
  
  console.log('🔍 Product handler called:', { id, userAgent, isCrawler: isCrawler(userAgent) });
  
  // Try multiple paths for index.html (Vercel deployment structure)
  const possiblePaths = [
    path.join(process.cwd(), '.vercel/output/static/index.html'),
    path.join(process.cwd(), 'dist/index.html'),
    path.join(__dirname, '../../dist/index.html'),
    path.join(__dirname, '../../../dist/index.html'),
    path.join(process.cwd(), 'index.html'),
  ];
  
  let indexPath = null;
  for (const possiblePath of possiblePaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        indexPath = possiblePath;
        console.log('✅ Found index.html at:', possiblePath);
        break;
      }
    } catch (e) {
      // Continue searching
    }
  }
  
  // IMPORTANT: If a regular user somehow reaches this function, 
  // serve the normal React app so React Router can handle routing
  // (This shouldn't happen due to vercel.json rewrite rules, but just in case)
  if (!isCrawler(userAgent)) {
    console.log('👤 Regular user detected, serving normal React app');
    if (indexPath) {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
    // Fallback: return basic HTML that will let React Router take over
    return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grace by Anu</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
  }
  
  console.log('🤖 CRAWLER DETECTED - Injecting meta tags for social sharing');
  console.log('📋 Request details:', {
    id,
    userAgent: userAgent.substring(0, 100),
    method: req.method,
    url: req.url
  });
  
  // For crawlers, fetch product data and inject meta tags
  if (!id) {
    console.error('❌ Product ID missing');
    // Even without ID, return basic HTML for crawlers
    const basicHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product - Grace by Anu</title>
    <meta property="og:title" content="Product - Grace by Anu" />
    <meta property="og:description" content="View our products at Grace by Anu" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    return res.send(basicHtml);
  }
  
  try {
    // Fetch product data
    console.log('📦 Fetching product data for ID:', id);
    const apiUrl = getApiUrl();
    console.log('🌐 Using API URL:', apiUrl);
    
    const product = await fetchProductData(id);
    
    if (!product) {
      console.error('❌ Product not found for ID:', id);
      // Return HTML with basic meta tags even if product not found
      const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product - Grace by Anu</title>
    <meta property="og:title" content="Product - Grace by Anu" />
    <meta property="og:description" content="View our products at Grace by Anu" />
    <meta property="og:image" content="${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://uk-candles.vercel.app'}/product.png" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
      res.setHeader('Content-Type', 'text/html');
      return res.send(fallbackHtml);
    }
    
    console.log('✅ Product fetched:', { name: product.name, hasImages: !!product.image1 });
    
    // Fetch company name
    console.log('🏢 Fetching company name...');
    const companyName = await fetchCompanyName();
    console.log('✅ Company name:', companyName);
    
    // Get the first available image
    const images = [
      product.image1,
      product.image2,
      product.image3,
      product.image4,
      product.image5,
      product.image6,
    ].filter(Boolean);
    
    const apiUrl = getApiUrl();
    const frontendUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');
    
    const ogImageUrl = getAbsoluteImageUrl(images[0], apiUrl);
    const ogDescription = cleanDescription(product.description, product.name, companyName);
    const pageTitle = `${product.name} | ${companyName}`;
    const pageUrl = `${frontendUrl}/product/${id}`;
    
    console.log('📝 Meta tags prepared:', {
      title: pageTitle,
      description: ogDescription.substring(0, 50) + '...',
      image: ogImageUrl,
      url: pageUrl,
      hasImage: !!images[0],
      imageUrl: images[0]
    });
    
    // Validate image URL is accessible
    if (!ogImageUrl || ogImageUrl.includes('/product.png')) {
      console.warn('⚠️ Using fallback product image');
    } else {
      console.log('✅ Product image URL:', ogImageUrl);
    }
    
    // Read index.html or create base HTML
    let html = '';
    
    if (indexPath) {
      try {
        html = fs.readFileSync(indexPath, 'utf-8');
        console.log('✅ Loaded index.html from:', indexPath);
      } catch (e) {
        console.warn('⚠️ Could not read index.html, using fallback:', e.message);
        html = '';
      }
    }
    
    // If we couldn't load HTML, create a minimal one
    if (!html) {
      console.log('📄 Creating fallback HTML');
      html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/logo-removebg-preview.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageTitle}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    }
    
    // Inject meta tags before closing </head>
    const metaTags = `
    <meta name="description" content="${ogDescription.replace(/"/g, '&quot;')}" />
    <meta property="og:title" content="${product.name.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${ogDescription.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${product.name.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="${companyName.replace(/"/g, '&quot;')}" />
    <meta property="product:price:amount" content="${product.price || 0}" />
    <meta property="product:price:currency" content="PKR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${product.name.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${ogDescription.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <meta name="twitter:image:alt" content="${product.name.replace(/"/g, '&quot;')}" />
    <link rel="canonical" href="${pageUrl}" />
`;
    
    // Replace title if it exists, or add before closing head
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>`);
    
    // Inject meta tags before closing </head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${metaTags}</head>`);
      console.log('✅ Injected meta tags before </head>');
    } else if (html.includes('<head>')) {
      // If </head> not found but <head> exists, add after opening tag
      html = html.replace('<head>', `<head>${metaTags}`);
      console.log('✅ Injected meta tags after <head>');
    } else {
      // If no head tag found, add before </html> or at the end
      if (html.includes('</html>')) {
        html = html.replace('</html>', `${metaTags}</html>`);
      } else {
        html = `${metaTags}${html}`;
      }
      console.log('✅ Injected meta tags at end of HTML');
    }
    
    // Verify meta tags are in the HTML
    if (html.includes('og:image')) {
      console.log('✅ Meta tags verified in HTML');
    } else {
      console.error('❌ Meta tags NOT found in HTML after injection!');
      console.error('HTML preview:', html.substring(0, 200));
    }
    
    // Set headers for proper caching and content type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-OG-Image', ogImageUrl); // Debug header
    res.setHeader('X-OG-Description', ogDescription.substring(0, 100)); // Debug header
    
    console.log('✅ Sending HTML with meta tags to crawler');
    return res.send(html);
    
  } catch (error) {
    console.error('❌ Error in product meta handler:', error);
    console.error('Error stack:', error.stack);
    // Fallback to normal HTML
    if (indexPath) {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
}

