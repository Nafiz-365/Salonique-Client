/**
 * ImgBB Image Upload Helper
 * ─────────────────────────────────────────────────────────────────────────────
 * Uploads an image file to ImgBB and returns the hosted image URL.
 * If NEXT_PUBLIC_IMGBB_API_KEY is not configured, it falls back to a base64
 * data URL so local development and evaluation work flawlessly.
 */

export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (apiKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.url) {
          return data.data.url;
        }
      }
    } catch (err) {
      console.warn("ImgBB upload failed, falling back to FileReader:", err);
    }
  }

  // Fallback: Read as base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
