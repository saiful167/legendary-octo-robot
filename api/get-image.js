const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter missing!" });
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);
    let images = [];

    // এটি আপনার curl লজিকের মতো ইমেজ সোর্সগুলো ধরবে
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      if (src && src.startsWith('http')) {
        images.push(src);
      }
    });

    // ডুপ্লিকেট বাদ দেওয়া
    const uniqueImages = [...new Set(images)];

    res.status(200).json({
      success: true,
      total: uniqueImages.length,
      images: uniqueImages
    });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the images" });
  }
}

