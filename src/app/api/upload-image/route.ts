import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const UPLOAD_WINDOW_MS = 60_000;
const MAX_UPLOADS_PER_WINDOW = 10;
const uploadAttempts = new Map<string, { count: number; resetAt: number }>();

function getUploadLimit(ip: string, now: number) {
    let bucket = uploadAttempts.get(ip);
    if (!bucket || bucket.resetAt <= now) {
        if (uploadAttempts.size >= 5_000) {
            for (const [key, value] of uploadAttempts) {
                if (value.resetAt <= now) uploadAttempts.delete(key);
            }
        }
        if (uploadAttempts.size >= 10_000 && !uploadAttempts.has(ip)) {
            return { allowed: false, retryAfter: 60 };
        }
        bucket = { count: 0, resetAt: now + UPLOAD_WINDOW_MS };
        uploadAttempts.set(ip, bucket);
    }

    if (bucket.count >= MAX_UPLOADS_PER_WINDOW) {
        return {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    bucket.count += 1;
    return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
    if (request.headers.get("sec-fetch-site") === "cross-site") {
        return NextResponse.json(
            { error: "Cross-site uploads are not allowed." },
            { status: 403 },
        );
    }

    const forwardedIp = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        .trim();
    const clientIp =
        request.headers.get("x-real-ip")?.trim() || forwardedIp || "unknown";
    const rateLimit = getUploadLimit(clientIp, Date.now());
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many image uploads. Please try again shortly." },
            {
                status: 429,
                headers: { "Retry-After": String(rateLimit.retryAfter) },
            },
        );
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_IMAGE_SIZE + 64_000
    ) {
        return NextResponse.json(
            { error: "Image must be 5 MB or smaller." },
            { status: 413 },
        );
    }

    const apiKey =
        process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Image upload is not configured." },
            { status: 503 },
        );
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json(
            { error: "Invalid image upload." },
            { status: 400 },
        );
    }

    const image = formData.get("image");
    if (!(image instanceof File) || !image.type.startsWith("image/")) {
        return NextResponse.json(
            { error: "Please upload a valid image file." },
            { status: 400 },
        );
    }
    if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
            { error: "Image must be 5 MB or smaller." },
            { status: 413 },
        );
    }

    const header = new Uint8Array(await image.slice(0, 12).arrayBuffer());
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng =
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47 &&
        header[4] === 0x0d &&
        header[5] === 0x0a &&
        header[6] === 0x1a &&
        header[7] === 0x0a;
    const isGif =
        String.fromCharCode(...header.slice(0, 6)) === "GIF87a" ||
        String.fromCharCode(...header.slice(0, 6)) === "GIF89a";
    const isWebp =
        String.fromCharCode(...header.slice(0, 4)) === "RIFF" &&
        String.fromCharCode(...header.slice(8, 12)) === "WEBP";
    const expectedType = isJpeg
        ? "image/jpeg"
        : isPng
          ? "image/png"
          : isGif
            ? "image/gif"
            : isWebp
              ? "image/webp"
              : null;
    if (!expectedType || image.type !== expectedType) {
        return NextResponse.json(
            { error: "Please upload a valid JPEG, PNG, GIF, or WebP image." },
            { status: 400 },
        );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    try {
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
            { method: "POST", body: uploadData, cache: "no-store" },
        );
        const result = await response.json();
        const url = result?.data?.url;

        if (!response.ok || typeof url !== "string") {
            return NextResponse.json(
                { error: "Image hosting service could not upload this file." },
                { status: 502 },
            );
        }

        return NextResponse.json({ url });
    } catch (error) {
        console.error("[Image upload] ImgBB request failed:", error);
        return NextResponse.json(
            { error: "Image hosting service is temporarily unavailable." },
            { status: 502 },
        );
    }
}
