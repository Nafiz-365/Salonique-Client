import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const apiKey =
    process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid image upload." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Please upload a valid image file." },
      { status: 400 }
    );
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 413 }
    );
  }

  const uploadData = new FormData();
  uploadData.append("image", image);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData, cache: "no-store" }
    );
    const result = await response.json();
    const url = result?.data?.url;

    if (!response.ok || typeof url !== "string") {
      return NextResponse.json(
        { error: "Image hosting service could not upload this file." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[Image upload] ImgBB request failed:", error);
    return NextResponse.json(
      { error: "Image hosting service is temporarily unavailable." },
      { status: 502 }
    );
  }
}
