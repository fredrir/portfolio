#!/usr/bin/env bun
/**
 * One-time gallery migration: Supabase Storage (and the bundled project
 * screenshots) into the media pipeline via the admin presigned-upload flow.
 *
 *   ADMIN_TOKEN=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   bun scripts/migrate-gallery.ts [--base https://hansteen.dev] [--dry-run]
 *
 * Idempotent: skips files whose (category, filename) already exists in the
 * media list. Throttled so the worker keeps up.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

const FOLDERS = ["Arkiv", "Interrail", "Krageroe", "Oslo", "Trondheim"];
const PROJECTS_DIR = "apps/web/public/gallery/projects";
const THROTTLE_MS = 4000;
const UA = "portfolio-gallery-migration/1.0";

const dryRun = process.argv.includes("--dry-run");
const baseIdx = process.argv.indexOf("--base");
const BASE = baseIdx > 0 ? process.argv[baseIdx + 1] : "https://hansteen.dev";

const adminToken = process.env.ADMIN_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!adminToken || !supabaseUrl || !supabaseKey) {
  console.error("ADMIN_TOKEN, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  process.exit(1);
}

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function contentTypeFor(name: string): string | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return CONTENT_TYPES[ext] ?? null;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("user-agent", UA);
  return fetch(`${BASE}${path}`, { ...init, headers });
}

async function existing(): Promise<Set<string>> {
  const res = await apiFetch("/api/v1/media?include_pending=true", {
    headers: { authorization: `Bearer ${adminToken}` },
  });
  if (!res.ok) throw new Error(`media list failed: ${res.status}`);
  const items = (await res.json()) as { filename: string; category?: string | null }[];
  return new Set(items.map((m) => `${m.category ?? ""}/${m.filename}`));
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^[_.]+|[_.]+$/g, "");
  return cleaned || "upload";
}

async function upload(
  category: string,
  filename: string,
  bytes: Uint8Array,
  seen: Set<string>,
): Promise<"uploaded" | "skipped" | "failed"> {
  const contentType = contentTypeFor(filename);
  if (!contentType) return "skipped";
  if (seen.has(`${category}/${sanitizeFilename(filename)}`)) return "skipped";
  if (dryRun) {
    console.log(`  would upload ${category}/${filename} (${bytes.length}b)`);
    return "uploaded";
  }

  const auth = await apiFetch("/api/v1/media/uploads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      filename,
      content_type: contentType,
      size_bytes: bytes.length,
      category,
    }),
  });
  if (!auth.ok) {
    console.error(`  authorize failed for ${filename}: ${auth.status}`);
    return "failed";
  }
  const { upload_url, headers } = (await auth.json()) as {
    upload_url: string;
    headers: Record<string, string>;
  };
  const putHeaders = Object.fromEntries(
    Object.entries(headers).filter(([k]) => k.toLowerCase() !== "host"),
  );
  const put = await fetch(upload_url, {
    method: "PUT",
    headers: putHeaders,
    body: bytes,
  });
  if (!put.ok) {
    console.error(`  PUT failed for ${filename}: ${put.status}`);
    return "failed";
  }
  await new Promise((r) => setTimeout(r, THROTTLE_MS));
  return "uploaded";
}

const seen = await existing();
console.log(`already in pipeline: ${seen.size}`);
const supabase = createClient(supabaseUrl, supabaseKey);
let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const folder of FOLDERS) {
  const { data, error } = await supabase.storage
    .from("Portfolio")
    .list(folder, { limit: 1000 });
  if (error) {
    console.error(`list ${folder}: ${error.message}`);
    failed++;
    continue;
  }
  const category = folder.toLowerCase();
  console.log(`${folder}: ${data?.length ?? 0} objects`);
  for (const file of data ?? []) {
    if (!file.name || file.name.startsWith(".")) continue;
    if (!contentTypeFor(file.name)) {
      console.log(`  skipping unsupported: ${file.name}`);
      skipped++;
      continue;
    }
    const dl = await supabase.storage
      .from("Portfolio")
      .download(`${folder}/${file.name}`);
    if (dl.error || !dl.data) {
      console.error(`  download ${file.name}: ${dl.error?.message}`);
      failed++;
      continue;
    }
    const bytes = new Uint8Array(await dl.data.arrayBuffer());
    const result = await upload(category, file.name, bytes, seen);
    if (result === "uploaded") uploaded++;
    else if (result === "skipped") skipped++;
    else failed++;
  }
}

console.log("projects (bundled):");
for (const name of await readdir(PROJECTS_DIR)) {
  if (!contentTypeFor(name)) {
    skipped++;
    continue;
  }
  const bytes = new Uint8Array(await readFile(join(PROJECTS_DIR, name)));
  const result = await upload("projects", name, bytes, seen);
  if (result === "uploaded") uploaded++;
  else if (result === "skipped") skipped++;
  else failed++;
}

console.log(`done: uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
process.exit(failed > 0 ? 1 : 0);
