import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    
    // Allow TENANT to upload slip
    if (decoded.role !== 'TENANT') {
      return NextResponse.json({ error: "Forbidden. Only tenants can upload slips." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads/slips");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Create unique filename
    const ext = path.extname(file.name);
    const filename = `slip_${decoded.id}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/slips/${filename}`;

    // Update the database
    await query(
      "UPDATE tenants SET bank_slip_url = $1, activation_status = 'PENDING' WHERE id = $2",
      [publicUrl, decoded.id]
    );

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Error uploading bank slip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
