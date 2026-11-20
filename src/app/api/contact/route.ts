import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};
const ALLOWED_SUBJECTS = new Set([
  "General Inquiry",
  "Order Support",
  "Shipping & Delivery",
  "Returns & Exchanges",
  "Product Information",
  "Sizing & Fit",
  "Partnership",
  "Other",
]);

function textValue(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let uploadedPath: string | null = null;
  const bucket = "contact-attachments";

  try {
    const formData = await request.formData();
    const name = textValue(formData.get("name"), 120);
    const email = textValue(formData.get("email"), 150).toLowerCase();
    const phone = textValue(formData.get("phone"), 25);
    const subject = textValue(formData.get("subject"), 60);
    const orderNumber = textValue(formData.get("orderNumber"), 60);
    const message = textValue(formData.get("message"), 2000);

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please provide a valid name and email." }, { status: 400 });
    }
    if (!ALLOWED_SUBJECTS.has(subject) || message.length < 10) {
      return NextResponse.json({ success: false, error: "Please check the subject and message." }, { status: 400 });
    }

    const admin = createAdminClient();
    const attachment = formData.get("attachment");
    let attachmentName: string | null = null;
    let attachmentPath: string | null = null;

    if (attachment instanceof File && attachment.size > 0) {
      const extension = ALLOWED_TYPES[attachment.type];
      if (!extension || attachment.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, error: "Attachment must be JPG, PNG, WEBP or PDF and no larger than 5 MB." }, { status: 400 });
      }

      const bytes = Buffer.from(await attachment.arrayBuffer());
      const fileName = `${randomUUID()}.${extension}`;
      uploadedPath = `messages/${fileName}`;
      const { error: uploadError } = await admin.storage.from(bucket).upload(uploadedPath, bytes, {
        contentType: attachment.type,
        upsert: false,
      });
      if (uploadError) throw uploadError;
      attachmentName = attachment.name.slice(0, 255);
      attachmentPath = uploadedPath;
    }

    const { error: insertError } = await admin.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject,
      order_number: orderNumber || null,
      message,
      attachment_name: attachmentName,
      attachment_path: attachmentPath,
      status: "new",
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (uploadedPath) {
      try {
        const admin = createAdminClient();
        await admin.storage.from(bucket).remove([uploadedPath]);
      } catch {
        // Keep the original request error as the useful response.
      }
    }
    console.error("TALA contact submission failed:", error);
    return NextResponse.json(
      { success: false, error: "We could not submit your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
