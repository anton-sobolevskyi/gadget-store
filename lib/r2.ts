import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Cloudflare R2 is S3-compatible; point the SDK at the account's R2 endpoint.
function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY."
    )
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

function getBucket() {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error("R2_BUCKET is not configured.")
  return bucket
}

/** Returns a short-lived URL a client can PUT a file to directly, without proxying bytes through the server. */
export async function getUploadUrl(key: string, contentType: string) {
  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(client, command, { expiresIn: 300 })
}

export async function deleteObject(key: string) {
  const client = getR2Client()
  await client.send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}

export function getPublicUrl(key: string) {
  const publicUrl = process.env.R2_PUBLIC_URL
  if (!publicUrl) throw new Error("R2_PUBLIC_URL is not configured.")
  return `${publicUrl.replace(/\/$/, "")}/${key}`
}
