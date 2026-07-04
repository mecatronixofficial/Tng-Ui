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

const IMAGE_TYPES_TO_OPTIMIZE = new Set(["image/jpeg", "image/png", "image/webp"]);
const DEFAULT_MAX_IMAGE_SIDE = 2200;
const DEFAULT_IMAGE_QUALITY = 0.82;
const OPTIMIZE_AFTER_BYTES = 1.5 * 1024 * 1024;

function extensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function renameImage(file: File, type: string) {
  const ext = extensionFromType(type);
  const name = file.name.replace(/\.[^.]+$/, "");
  return `${name || "image"}.${ext}`;
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not prepare this image for upload."));
      },
      type,
      quality,
    );
  });
}

export async function optimizeImageForUpload(
  file: File,
  options: { maxSide?: number; quality?: number } = {},
): Promise<File> {
  if (!IMAGE_TYPES_TO_OPTIMIZE.has(file.type)) return file;
  if (typeof window === "undefined") return file;

  const maxSide = options.maxSide ?? DEFAULT_MAX_IMAGE_SIDE;
  const quality = options.quality ?? DEFAULT_IMAGE_QUALITY;

  let bitmap: ImageBitmap;
  try {
    bitmap = await loadBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const shouldOptimize = scale < 1 || file.size > OPTIMIZE_AFTER_BYTES;

  if (!shouldOptimize) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let outputType = "image/webp";
  let blob: Blob;

  try {
    blob = await canvasToBlob(canvas, outputType, quality);
  } catch {
    outputType = "image/jpeg";
    blob = await canvasToBlob(canvas, outputType, quality);
  }

  if (blob.size >= file.size) return file;

  return new File([blob], renameImage(file, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });
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
