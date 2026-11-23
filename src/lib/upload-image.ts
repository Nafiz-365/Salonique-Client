export async function uploadToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Image upload failed.");
    }

    if (typeof result.url !== "string") {
        throw new Error("Image hosting service returned an invalid URL.");
    }
    return result.url;
}
