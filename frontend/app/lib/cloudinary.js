export async function fetchWallpapersFromCloudinary() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const folder = process.env.NEXT_PUBLIC_WALLPAPERS_FOLDER || 'wallpapers';

    if (!cloudName) {
      throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set');
    }

    console.log(`📡 Fetching wallpapers from Cloudinary folder: ${folder}`);

    // Use Cloudinary's public Search API (no auth needed for public resources)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expression: `folder="${folder}" AND (resource_type:video OR resource_type:image)`,
          sort_by: [['created_at', 'desc']],
          max_results: 500,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Loaded ${data.resources?.length || 0} wallpapers`);

    // Transform Cloudinary resources to our format
    const wallpapers = (data.resources || []).map((resource) => {
      const isVideo = resource.resource_type === 'video';
      const cdnUrl = getOptimizedUrl(cloudName, resource, isVideo);

      return {
        id: resource.public_id,
        src: cdnUrl,
        type: isVideo ? 'video' : 'image',
        name: resource.display_name || extractFileName(resource.public_id),
        publicId: resource.public_id,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        duration: resource.duration || null,
        size: resource.bytes,
        uploadedAt: resource.created_at,
      };
    });

    return {
      success: true,
      wallpapers,
      total: wallpapers.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch from Cloudinary:', error.message);
    return {
      success: false,
      wallpapers: [],
      total: 0,
      error: error.message,
    };
  }
}

/**
 * Generate optimized Cloudinary URL with transformations
 */
function getOptimizedUrl(cloudName, resource, isVideo) {
  const publicId = resource.public_id;
  const format = resource.format;

  if (isVideo) {
    // Optimized video URL
    return (
      `https://res.cloudinary.com/${cloudName}/video/upload/` +
      `q_auto:low,` + // Auto quality (low for better performance)
      `f_auto,` + // Auto format (mp4/webm based on browser)
      `dpr_auto,` + // Auto device pixel ratio
      `c_fill,w_1920,h_1080,g_auto/` + // Responsive with auto gravity
      `${publicId}.${format}`
    );
  } else {
    // Optimized image URL
    return (
      `https://res.cloudinary.com/${cloudName}/image/upload/` +
      `q_auto,` + // Auto quality
      `f_auto,` + // Auto format (WebP on supported browsers)
      `dpr_auto,` + // Auto device pixel ratio
      `c_fill,w_1920,h_1080,g_auto/` + // Responsive with auto gravity
      `${publicId}.${format}`
    );
  }
}

/**
 * Extract clean filename from public_id
 */
function extractFileName(publicId) {
  const parts = publicId.split('/');
  let name = parts[parts.length - 1];
  name = name.replace(/[-_]/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Get direct Cloudinary URL (unoptimized)
 */
export function getCloudinaryUrl(publicId, cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/**
 * Get video thumbnail
 */
export function getVideoThumbnail(publicId, cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  return (
    `https://res.cloudinary.com/${cloudName}/video/upload/` +
    `f_auto,q_auto,w_400,h_300,c_fill/` +
    `${publicId}.jpg`
  );
}

/**
 * Cache wallpapers in localStorage (optional)
 */
export function cacheWallpapers(wallpapers, ttl = 3600000) {
  // ttl = 1 hour default
  const cacheData = {
    wallpapers,
    timestamp: Date.now(),
    ttl,
  };
  localStorage.setItem('wallpapers_cache', JSON.stringify(cacheData));
}

/**
 * Get wallpapers from cache if valid
 */
export function getCachedWallpapers() {
  try {
    const cached = localStorage.getItem('wallpapers_cache');
    if (!cached) return null;

    const { wallpapers, timestamp, ttl } = JSON.parse(cached);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem('wallpapers_cache');
      return null;
    }

    console.log('📦 Using cached wallpapers');
    return wallpapers;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

/**
 * Fetch with cache support
 */
export async function fetchWallpapersWithCache(useCache = true) {
  if (useCache) {
    const cached = getCachedWallpapers();
    if (cached) return { success: true, wallpapers: cached, total: cached.length, fromCache: true };
  }

  const result = await fetchWallpapersFromCloudinary();

  if (result.success) {
    cacheWallpapers(result.wallpapers);
  }

  return result;
}