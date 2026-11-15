/**
 * Uploads a file directly from the browser to Cloudinary (unsigned upload)
 * with automatic client-side compression and returns the secure URL.
 *
 * NOTE: This intentionally uses ONLY the cloud name + unsigned upload preset.
 * The Cloudinary API secret must never be included in frontend code.
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Compresses an image in the browser using HTML5 Canvas.
 * Reduces 10MB+ high-res mobile photos down to ~200-400KB WebP
 * without noticeable visual loss, speeding up uploads by 10x.
 */
export async function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.84 } = {}) {
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxWidth && height <= maxHeight && file.size < 600 * 1024) {
          return resolve(file);
        }
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve(file);
            }
            const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, '');
            const compressedFile = new File([blob], `${cleanName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadToCloudinary(file, { folder = 'gadaesthetics' } = {}) {
  if (!file) throw new Error('No file provided for upload.');
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Check VITE_CLOUDINARY_* variables in .env');
  }

  // Pre-compress image for fast upload and zero timeout
  const readyFile = await compressImage(file);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', readyFile);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);

  let res = await fetch(url, { method: 'POST', body: formData });

  // Fallback retry: if custom folder is rejected by Cloudinary preset, retry without folder
  if (!res.ok && folder) {
    try {
      const retryData = new FormData();
      retryData.append('file', readyFile);
      retryData.append('upload_preset', UPLOAD_PRESET);
      const retryRes = await fetch(url, { method: 'POST', body: retryData });
      if (retryRes.ok) res = retryRes;
    } catch (_) {
      // keep original response
    }
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      detail = err?.error?.message || detail;
    } catch {
      /* keep statusText */
    }
    throw new Error(`Cloudinary upload failed: ${detail}`);
  }

  const data = await res.json();
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

export function isImageFile(file) {
  return file && (
    (file.type && file.type.startsWith('image/')) ||
    /\.(jpg|jpeg|png|webp|gif|avif|heic|heif)$/i.test(file.name || '')
  );
}

export function validateImage(file, maxMB = 15) {
  if (!isImageFile(file)) return 'Please select a valid image file (JPG, PNG, WebP, etc.).';
  if (file.size > maxMB * 1024 * 1024) return `Image must be smaller than ${maxMB}MB.`;
  return null;
}
