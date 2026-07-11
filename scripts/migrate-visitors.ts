#!/usr/bin/env bun
/**
 * One-time migration of the `visitors` table from Supabase to the
 * portfolio Postgres database (apps/api).
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   DATABASE_URL=postgres://portfolio:portfolio@localhost:5432/portfolio \
 *   bun scripts/migrate-visitors.ts [--dry-run] [--append]
 *
 * --dry-run  fetch and count source rows without writing
 * --append   allow inserting into a non-empty target table
 */
import { SQL } from "bun";
import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 1000;

interface SourceRow {
  page: string | null;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  created_at: string | null;
}

const dryRun = process.argv.includes("--dry-run");
const append = process.argv.includes("--append");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).",
  );
  process.exit(1);
}
if (!databaseUrl && !dryRun) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rows: SourceRow[] = [];
for (let offset = 0; ; offset += PAGE_SIZE) {
  const { data, error } = await supabase
    .from("visitors")
    .select("page, referrer, user_agent, country, created_at")
    .order("id", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);
  if (error) {
    console.error(`Failed to read visitors (offset ${offset}):`, error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) break;
  rows.push(...(data as SourceRow[]));
  console.log(`Fetched ${rows.length} rows...`);
  if (data.length < PAGE_SIZE) break;
}

console.log(`Source rows: ${rows.length}`);
if (dryRun) {
  console.log("Dry run; nothing written.");
  process.exit(0);
}
if (rows.length === 0) {
  console.log("Nothing to migrate.");
  process.exit(0);
}

const sql = new SQL(databaseUrl!);

const [{ count: existing }] = await sql`
  select count(*)::int as count from visitors
`;
if (existing > 0 && !append) {
  console.error(
    `Target table already has ${existing} rows; re-run with --append to insert anyway.`,
  );
  process.exit(1);
}

const values = rows.map((r) => ({
  page: r.page ?? "/",
  referrer: r.referrer,
  user_agent: r.user_agent,
  country: r.country,
  created_at: r.created_at ?? new Date().toISOString(),
}));

let inserted = 0;
for (let i = 0; i < values.length; i += PAGE_SIZE) {
  const batch = values.slice(i, i + PAGE_SIZE);
  await sql`insert into visitors ${sql(batch)}`;
  inserted += batch.length;
  console.log(`Inserted ${inserted}/${values.length}`);
}

const [{ count: total }] = await sql`
  select count(*)::int as count from visitors
`;
console.log(`Done. Target table now has ${total} rows.`);
await sql.end();
