import { readFileSync } from 'fs';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const CLOUD_NAME = 'frbrngr7';
const UPLOAD_PRESET = 'GADaesthetics';

async function uploadImage(filePath, folder, label) {
  console.log(`\nUploading ${label}...`);
  const form = new FormData();
  form.append('file', createReadStream(filePath));
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', folder);
  form.append('quality', 'auto:best');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (data.secure_url) {
    console.log(`✅ ${label} uploaded!`);
    console.log(`   URL: ${data.secure_url}`);
    return data.secure_url;
  } else {
    console.error(`❌ Failed to upload ${label}:`, JSON.stringify(data));
    return null;
  }
}

const consultationBg = await uploadImage(
  'C:/Users/Abdullah Younas/.gemini/antigravity/brain/e09a6cc0-65a1-4da0-9f94-dca10d76e048/.user_uploaded/media_1794943084336_b2e59c08.jpg',
  'gadaesthetics/consultation',
  'Consultation BG Image (Woman Face)'
);

const doctorPhoto = await uploadImage(
  'C:/Users/Abdullah Younas/.gemini/antigravity/brain/e09a6cc0-65a1-4da0-9f94-dca10d76e048/.user_uploaded/media_1794943084353_9a9f9d03.jpg',
  'gadaesthetics/doctor',
  'Dr. Abdullah Asif Photo'
);

console.log('\n=== FINAL URLs ===');
console.log('CONSULTATION_BG:', consultationBg);
console.log('DOCTOR_PHOTO:   ', doctorPhoto);
