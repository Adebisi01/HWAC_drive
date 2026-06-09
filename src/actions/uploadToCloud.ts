"use server";
import { getB2Files } from "./b2-files";
/**
 * Same-origin upload proxy: browser POSTs here; server writes to B2 with files-sdk.
 * Supports:
 * - `multipart/form-data` with `file` (Blob/File) and optional `key` (recommended from browsers)
 * - Raw body + `?key=` + `Content-Type` (e.g. curl)
 */
export const uploadToCloud = async (file: File) => {
  try {
    // let key = url.searchParams.get('key')?.trim() || DEFAULT_KEY;
    // const contentTypeHeader = request.headers.get('content-type') || '';
    // let bodyBuffer: Buffer;
    // let contentType: string;

    // if (contentTypeHeader.includes("multipart/form-data")) {
    // const form = await request.formData();
    // const k = form.get("key");
    // if (typeof k === "string" && k.trim()) key = k.trim();
    // const file = form.get("file");
    if (!(file instanceof Blob)) {
      return Response.json(
        { error: "Missing file field (use multipart field name: file)" },
        { status: 400 },
      );
    }

    const contentType = file.type || "application/octet-stream";
    const bodyBuffer = new Uint8Array(await file.arrayBuffer());

    // } else {
    //   contentType =
    //     contentTypeHeader.split(";")[0]?.trim() || "application/octet-stream";
    //   bodyBuffer = Buffer.from(await request.arrayBuffer());
    // }

    if (bodyBuffer.length === 0) {
      return Response.json({ error: "Empty body" }, { status: 400 });
    }

    const files = getB2Files();
    const uploadRes = await files.upload(file.name, bodyBuffer, {
      contentType,
    });
    console.log("uploadRes, v", uploadRes);

    return { ok: true, key: file.name };
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};
