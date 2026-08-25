/**
 * Uploads a file directly from the browser to Cloudinary (unsigned upload)
 * and returns the secure URL that callers persist into Firestore.
 *
 * NOTE: This intentionally uses ONLY the cloud name + unsigned upload preset.
 * The Cloudinary API secret must never be included in frontend code.
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file, { folder = 'gadaesthetics' } = {}) {
  if (!file) throw new Error('No file provided for upload.');
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Check VITE_CLOUDINARY_* variables in .env');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(url, { method: 'POST', body: formData });
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
  return file && file.type && file.type.startsWith('image/');
}

export function validateImage(file, maxMB = 8) {
  if (!isImageFile(file)) return 'Please select an image file (JPG, PNG, WebP).';
  if (file.size > maxMB * 1024 * 1024) return `Image must be smaller than ${maxMB}MB.`;
  return null;
}
