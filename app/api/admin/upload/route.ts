import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";

    if (!cloudinaryUrl || !cloudName) {
      console.warn("Cloudinary URL or Cloud Name not configured. Simulating upload locally using Base64 Data URL.");
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
      
      return NextResponse.json({
        success: true,
        simulated: true,
        url: base64Image
      });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary Upload failed: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      simulated: false,
      url: data.secure_url
    });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
