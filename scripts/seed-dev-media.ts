#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const ROOT = process.cwd();
const PROJECTS_DIR = join(ROOT, "apps/web/public/gallery/projects");
const PUBLIC_DIR = join(ROOT, "apps/web/public");
const BUCKET = process.env.MEDIA_BUCKET || "portfolio-media-dev";
const S3_ENDPOINT = (process.env.AWS_ENDPOINT_URL || "http://127.0.0.1:4566").replace(/\/$/, "");
const PUBLIC_BASE_URL = (process.env.MEDIA_PUBLIC_BASE_URL || `${S3_ENDPOINT}/${BUCKET}`).replace(
  /\/$/,
  "",
);

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

interface SeedSpec {
  category: string;
  source: string;
  filename?: string;
  exif?: SeedExif;
}

/** Mirrors the worker-extracted EXIF columns so the dev gallery shows metadata. */
interface SeedExif {
  takenAt: string;
  camera: string;
  lens: string | null;
  focalLengthMm: number;
  aperture: number;
  shutterSeconds: number;
  iso: number;
  latitude: number | null;
  longitude: number | null;
}

interface Dimensions {
  width: number;
  height: number;
}

function sql(value: string | number | null): string {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  return `'${value.replaceAll("'", "''")}'`;
}

function sanitizeName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^[_.]+|[_.]+$/g, "");
  return cleaned || "upload";
}

function uuidFromSeed(seed: string): string {
  const bytes = createHash("sha256").update(seed).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20)}`;
}

function sha256(bytes: Buffer): string {
  return createHash("sha256")
    .update(bytes as unknown as Uint8Array)
    .digest("hex");
}

function dimensionsOf(bytes: Buffer, contentType: string): Dimensions {
  const view = new DataView(bytes.buffer as ArrayBuffer, bytes.byteOffset, bytes.byteLength);
  if (contentType === "image/png") {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (contentType === "image/jpeg") {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = view.getUint16(offset + 2);
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          height: view.getUint16(offset + 5),
          width: view.getUint16(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  if (contentType === "image/webp") {
    const riff = bytes.subarray(0, 12).toString("ascii");
    if (!riff.startsWith("RIFF") || !riff.endsWith("WEBP")) {
      throw new Error("invalid WebP header");
    }
    const chunk = bytes.subarray(12, 16).toString("ascii");
    if (chunk === "VP8X") {
      const width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
      const height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
      return { width, height };
    }
    if (chunk === "VP8L") {
      const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8 ") {
      return {
        width: view.getUint16(26, true) & 0x3fff,
        height: view.getUint16(28, true) & 0x3fff,
      };
    }
  }

  throw new Error(`cannot read dimensions for ${contentType}`);
}

function objectUrl(key: string): string {
  return `${S3_ENDPOINT}/${BUCKET}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

async function putObject(key: string, bytes: Buffer, contentType: string): Promise<void> {
  const response = await fetch(objectUrl(key), {
    method: "PUT",
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": contentType,
    },
    body: bytes,
  });
  if (!response.ok) {
    throw new Error(`LocalStack put failed for ${key}: ${response.status}`);
  }
}

const SAMPLE_EXIF: Record<string, SeedExif> = {
  "20250609_132456000_iOS.jpg": {
    takenAt: "2025-06-09 13:24:56",
    camera: "Apple iPhone 15 Pro",
    lens: "Main Camera 24mm f/1.78",
    focalLengthMm: 6.8,
    aperture: 1.8,
    shutterSeconds: 1 / 120,
    iso: 64,
    latitude: 63.4305,
    longitude: 10.3951,
  },
  "20250429_114135877_iOS.jpg": {
    takenAt: "2025-04-29 11:41:35",
    camera: "FUJIFILM X-T5",
    lens: "XF23mmF1.4 R LM WR",
    focalLengthMm: 23,
    aperture: 1.4,
    shutterSeconds: 1 / 250,
    iso: 320,
    latitude: 59.9139,
    longitude: 10.7522,
  },
  "20250706_171110387_iOS.webp": {
    takenAt: "2025-07-06 17:11:10",
    camera: "NIKON COOLPIX S3000",
    lens: null,
    focalLengthMm: 4.9,
    aperture: 3.2,
    shutterSeconds: 1 / 25,
    iso: 200,
    latitude: null,
    longitude: null,
  },
};

async function seedSpecs(): Promise<SeedSpec[]> {
  // The static projects gallery was removed with the Supabase fallback; keep
  // scanning so fixtures reappear automatically if the directory returns.
  const projectFiles = (await readdir(PROJECTS_DIR).catch(() => [] as string[]))
    .filter((name) => CONTENT_TYPES[extname(name).toLowerCase()])
    .sort()
    .map((name) => ({ category: "projects", source: join(PROJECTS_DIR, name) }));

  const sampled = [
    ["trondheim", "Contact_Fredrik_Carsten_Hansteen.png", "20260302_173444891_iOS.png"],
    ["trondheim", "Fredrik_Carsten_Hansteen.png", "20260115_200235561_iOS.png"],
    ["trondheim", "app-picture-3.jpg", "20250609_132456000_iOS.jpg"],
    ["trondheim", "screenshot.png", "20240913_091658856_iOS.png"],
    ["trondheim", "rif-mobile.jpg", "20240517_092725267_iOS.jpg"],
    ["oslo", "portfolio.png", "20251221_165203444_iOS.png"],
    ["oslo", "app-picture-2.jpg", "20250429_114135877_iOS.jpg"],
    ["oslo", "online-opptak.png", "20240803_190951000_iOS.png"],
    ["oslo", "norges-tilstand.png", "20210517_062750110_iOS.png"],
    ["interrail", "movie-tracker.png", "20250818_135742000_iOS.png"],
    ["interrail", "y.png", "20250715_153818778_iOS.png"],
    ["interrail", "app-picture.png", "20250709_121734878_iOS.png"],
    ["interrail", "onlove.webp", "20250706_171110387_iOS.webp"],
    ["krageroe", "seniorbank.png", "20250629_171924864_iOS.png"],
    ["krageroe", "onlinefondet.png", "20250628_170603000_iOS.png"],
    ["krageroe", "rif.png", "20240629_195537621_iOS.png"],
    ["arkiv", "android-chrome-512x512.png", "20251002_095710160_iOS.png"],
    ["arkiv", "apple-touch-icon.png", "20220616_142248000_iOS.png"],
    ["arkiv", "nat-logo.png", "20210630_182012798_iOS.png"],
    ["arkiv", "favicon-32x32.png", "20120804_165552000_iOS.png"],
  ].map(([category, source, filename]) => ({
    category,
    source: join(PUBLIC_DIR, source),
    filename,
    exif: SAMPLE_EXIF[filename],
  }));

  return [...projectFiles, ...sampled];
}

function readySeedCount(keys: string[]): number | undefined {
  const keyList = keys.map(sql).join(", ");
  const result = spawnSync(
    "docker",
    [
      "compose",
      "exec",
      "-T",
      "db",
      "psql",
      "-U",
      "portfolio",
      "-d",
      "portfolio",
      "-At",
      "-c",
      `select count(*) from media where original_key in (${keyList}) and state = 'ready'`,
    ],
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  if (result.status !== 0) return undefined;
  const count = Number.parseInt(result.stdout.trim(), 10);
  return Number.isFinite(count) ? count : undefined;
}

async function main() {
  const specs = await seedSpecs();
  if (process.env.DEV_SEED_IF_PRESENT === "skip") {
    const seedKeys = specs.map((spec) => {
      const filename = sanitizeName(spec.filename || basename(spec.source));
      return `originals/dev/${spec.category}/${filename}`;
    });
    const existing = readySeedCount(seedKeys);
    if (existing !== undefined && existing >= specs.length) {
      console.log(`[dev-seed] ${existing} ready fixtures already present; skipping`);
      return;
    }
  }

  const statements: string[] = ["begin;"];

  let seeded = 0;
  for (const [index, spec] of specs.entries()) {
    const sourceName = basename(spec.source);
    const filename = sanitizeName(spec.filename || sourceName);
    const contentType = CONTENT_TYPES[extname(sourceName).toLowerCase()];
    if (!contentType) continue;

    const bytes = await readFile(spec.source);
    const dimensions = dimensionsOf(bytes, contentType);
    const hash = sha256(bytes);
    const mediaId = uuidFromSeed(`${spec.category}/${filename}`);
    const originalKey = `originals/dev/${spec.category}/${filename}`;
    const variantBase = `variants/dev/${spec.category}/${hash.slice(0, 16)}-${filename}`;
    const webpKey = `${variantBase}.webp`;
    const avifKey = `${variantBase}.avif`;
    const createdAt = new Date(Date.now() - index * 60_000).toISOString();

    await putObject(originalKey, bytes, contentType);
    await putObject(webpKey, bytes, contentType);
    await putObject(avifKey, bytes, contentType);

    const exif = spec.exif;
    statements.push(
      `insert into media (id, original_key, filename, content_type, size_bytes, width, height, content_hash, state, category, taken_at, camera, lens, focal_length_mm, aperture, shutter_seconds, iso, latitude, longitude, created_at, updated_at)
       values (${sql(mediaId)}, ${sql(originalKey)}, ${sql(filename)}, ${sql(contentType)}, ${sql(bytes.length)}, ${sql(
         dimensions.width,
       )}, ${sql(dimensions.height)}, ${sql(hash)}, 'ready', ${sql(spec.category)}, ${sql(
         exif?.takenAt ?? null,
       )}, ${sql(exif?.camera ?? null)}, ${sql(exif?.lens ?? null)}, ${sql(
         exif?.focalLengthMm ?? null,
       )}, ${sql(exif?.aperture ?? null)}, ${sql(exif?.shutterSeconds ?? null)}, ${sql(
         exif?.iso ?? null,
       )}, ${sql(exif?.latitude ?? null)}, ${sql(exif?.longitude ?? null)}, ${sql(
         createdAt,
       )}, ${sql(createdAt)})
       on conflict (original_key) do update set
         filename = excluded.filename,
         content_type = excluded.content_type,
         size_bytes = excluded.size_bytes,
         width = excluded.width,
         height = excluded.height,
         content_hash = excluded.content_hash,
         state = 'ready',
         error = null,
         category = excluded.category,
         taken_at = excluded.taken_at,
         camera = excluded.camera,
         lens = excluded.lens,
         focal_length_mm = excluded.focal_length_mm,
         aperture = excluded.aperture,
         shutter_seconds = excluded.shutter_seconds,
         iso = excluded.iso,
         latitude = excluded.latitude,
         longitude = excluded.longitude,
         updated_at = now();`,
      `insert into media_variants (media_id, format, key, width, height, size_bytes)
       values (${sql(mediaId)}, 'webp', ${sql(webpKey)}, ${sql(dimensions.width)}, ${sql(
         dimensions.height,
       )}, ${sql(bytes.length)})
       on conflict (media_id, format) do update set
         key = excluded.key,
         width = excluded.width,
         height = excluded.height,
         size_bytes = excluded.size_bytes;`,
      `insert into media_variants (media_id, format, key, width, height, size_bytes)
       values (${sql(mediaId)}, 'avif', ${sql(avifKey)}, ${sql(dimensions.width)}, ${sql(
         dimensions.height,
       )}, ${sql(bytes.length)})
       on conflict (media_id, format) do update set
         key = excluded.key,
         width = excluded.width,
         height = excluded.height,
         size_bytes = excluded.size_bytes;`,
    );
    seeded++;
  }

  const failedId = uuidFromSeed("dev/failed/fake.png");
  statements.push(
    `insert into media (id, original_key, filename, content_type, size_bytes, state, error, category)
     values (${sql(failedId)}, 'originals/dev/_failed/fake.png', 'fake.png', 'image/png', 970, 'failed', 'dev seed: processing failed fixture', null)
     on conflict (original_key) do update set state = 'failed', error = excluded.error, updated_at = now();`,
    "commit;",
  );

  const result = spawnSync(
    "docker",
    [
      "compose",
      "exec",
      "-T",
      "db",
      "psql",
      "-U",
      "portfolio",
      "-d",
      "portfolio",
      "-v",
      "ON_ERROR_STOP=1",
      "--quiet",
    ],
    { cwd: ROOT, input: statements.join("\n"), stdio: ["pipe", "inherit", "inherit"] },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log(
    `[dev-seed] media ready: ${seeded} items + failed fixture, public base ${PUBLIC_BASE_URL}`,
  );
}

main().catch((error) => {
  console.error("[dev-seed] failed:", error);
  process.exit(1);
});
