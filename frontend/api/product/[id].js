// Serverless function to serve OG meta tags for product pages
// This is called when social media crawlers visit /product/:id

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Check if this is a crawler request
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|SkypeUriPreview|bingbot|Googlebot/i.test(userAgent);
  
  // If not a crawler, let the React app handle it
  if (!isCrawler) {
    return res.redirect(302, `/?product=${id}`);
  }
  
  try {
    // Fetch product data from backend API
    // Use environment variable or construct from request
    const apiUrl = process.env.VITE_API_URL 
      ? process.env.VITE_API_URL.replace('/api', '')
      : (process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL.replace('uk-candles', 'uk-candles-backend') || 'uk-candles-backend.vercel.app'}`
          : 'http://localhost:5000');
    
    const response = await fetch(`${apiUrl}/api/products/${id}`);
    
    if (!response.ok) {
      return res.status(404).send('Product not found');
    }
    
    const product = await response.json();
    const companyName = process.env.COMPANY_NAME || 'Grace By Anu';
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (req.headers.host ? `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}` : 'https://uk-candles.vercel.app');
    
    // Get absolute image URL
    const getAbsoluteImageUrl = (imageUrl) => {
      if (!imageUrl || imageUrl === '/product.png' || imageUrl.trim() === '') {
        return `${baseUrl}/product.png`;
      }
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      const apiBaseUrl = apiUrl.replace('/api', '');
      return imageUrl.startsWith('/') ? `${apiBaseUrl}${imageUrl}` : `${apiBaseUrl}/${imageUrl}`;
    };
    
    // Clean description
    const cleanDescription = (desc) => {
      if (!desc) return `${product.name} - Available at ${companyName}`;
      let text = desc.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (text.length > 200) {
        text = text.substring(0, 197) + '...';
      }
      return text || `${product.name} - Available at ${companyName}`;
    };
    
    const ogImageUrl = getAbsoluteImageUrl(product.image1);
    const ogDescription = cleanDescription(product.description);
    const productUrl = `${baseUrl}/product/${id}`;
    const pageTitle = `${product.name} | ${companyName}`;
    
    // Escape HTML
    const escapeHtml = (text) => {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    // Return HTML with OG tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${productUrl}">
  <meta property="og:title" content="${escapeHtml(product.name)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(product.name)}">
  <meta property="og:site_name" content="${escapeHtml(companyName)}">
  <meta property="product:price:amount" content="${product.price || 0}">
  <meta property="product:price:currency" content="${product.currency || 'PKR'}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${productUrl}">
  <meta name="twitter:title" content="${escapeHtml(product.name)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(product.name)}">
  
  <!-- Redirect to actual product page for browsers -->
  <meta http-equiv="refresh" content="0;url=${productUrl}">
  <script>window.location.href = "${productUrl}";</script>
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${escapeHtml(product.name)}</a>...</p>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.send(html);
  } catch (error) {
    console.error('Error generating OG tags:', error);
    res.status(500).send('Error generating meta tags');
  }
}
