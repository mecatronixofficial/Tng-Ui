/**
 * Unsigned Cloudinary upload — runs entirely in the browser using your
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
 *
 * Set the upload preset to "Unsigned" in Cloudinary → Settings → Upload.
 * For server-signed uploads (recommended for production), add an /api route
 * that signs the request with your API secret.
 */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    let message = res.statusText || "Upload failed";

    try {
      const payload = await res.json();
      message = payload?.error?.message || payload?.message || message;
    } catch {
      // Keep the HTTP status text if Cloudinary did not send JSON.
    }

    throw new Error(`Cloudinary upload failed: ${message}`);
  }

  return (await res.json()) as CloudinaryUploadResult;
}

/**
 * Build a transformed Cloudinary URL from an existing public_id.
 * Useful for serving optimized variants without re-uploading.
 */
export function cloudinaryUrl(
  publicId: string,
  opts: { w?: number; h?: number; q?: number | "auto"; f?: "auto" | "webp" } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  const parts: string[] = [];
  if (opts.w) parts.push(`w_${opts.w}`);
  if (opts.h) parts.push(`h_${opts.h}`);
  parts.push(`q_${opts.q ?? "auto"}`);
  parts.push(`f_${opts.f ?? "auto"}`);
  const transform = parts.join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
