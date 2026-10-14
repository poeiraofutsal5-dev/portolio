/**
 * Image optimization utility for JPX Studio.
 * Automatically downscales and compresses uploaded images so they remain sharp
 * on Retina displays while staying well under Firestore's 1 MiB document size limit.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export async function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    format = file.type === 'image/png' ? 'image/png' : 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original src if canvas fails
          resolve(src);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try preferred format with quality
        try {
          let dataUrl = canvas.toDataURL(format, quality);

          // If PNG is too large (e.g., > 400KB), convert to WebP or high-quality JPEG
          if (format === 'image/png' && dataUrl.length > 500000) {
            dataUrl = canvas.toDataURL('image/webp', 0.85);
          }

          resolve(dataUrl);
        } catch {
          // If WebP is unsupported or fails, fallback to JPEG
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            resolve(src);
          }
        }
      };

      img.onerror = () => {
        // Fallback to original
        resolve(src);
      };

      img.src = src;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes logo images to maintain crisp transparency while remaining tiny in payload.
 * Supports SVG directly for lossless vector quality, and optimizes PNG/WebP with transparency.
 */
export async function optimizeLogoFile(file: File): Promise<string> {
  // If user uploads an SVG, keep lossless vector precision if size is reasonable
  if (file.type.includes('svg') || file.name.toLowerCase().endsWith('.svg')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && result.length < 400000) {
          resolve(result);
        } else {
          // If unusually huge SVG, fallback to canvas optimization
          optimizeImageFile(file, {
            maxWidth: 600,
            maxHeight: 240,
            quality: 0.9,
            format: 'image/png',
          }).then(resolve).catch(reject);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return optimizeImageFile(file, {
    maxWidth: 600,
    maxHeight: 240,
    quality: 0.9,
    format: file.type === 'image/png' ? 'image/png' : 'image/webp',
  });
}
