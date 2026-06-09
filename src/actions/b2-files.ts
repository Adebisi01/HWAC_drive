import { Files } from "files-sdk";
import { backblazeB2 } from "files-sdk/backblaze-b2";

function normalizeB2Endpoint(raw: string | undefined): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  if (t.startsWith("https://") || t.startsWith("http://")) return t;
  return `https://${t}`;
}

/**
 * Backblaze B2 via files-sdk (S3-compatible API).
 * Required: `B2_APPLICATION_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET` (must exist in the account and match `B2_REGION` cluster).
 * Optional: `B2_REGION` (defaults to `eu-central-003`). `B2_ENDPOINT` overrides the S3 API host (e.g. `https://s3.eu-central-003.backblazeb2.com` or `s3.eu-central-003.backblazeb2.com`).
 */
export function getB2Files(): Files {
  const bucket = import.meta.env.VITE_B2_BUCKET?.trim();
  const region = (import.meta.env.VITE_B2_REGION ?? "eu-central-003").trim();
  const accessKeyId = import.meta.env.VITE_B2_APPLICATION_KEY_ID?.trim();
  const secretAccessKey = import.meta.env.VITE_B2_APPLICATION_KEY?.trim();
  const endpoint = normalizeB2Endpoint(import.meta.env.VITE_B2_ENDPOINT);

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing B2 credentials: set B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY in .env.local (or host env).",
    );
  }

  if (!bucket) {
    throw new Error(
      "Missing B2_BUCKET: set the exact bucket name from the Backblaze console. It must exist in the same region as B2_REGION (e.g. eu-central-003), and your app key must allow that bucket.",
    );
  }

  return new Files({
    adapter: backblazeB2({
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
      ...(endpoint ? { endpoint } : {}),
    }),
  });
}
