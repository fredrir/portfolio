import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const localDefaults: Record<string, string> = {
  API_ADDR: "127.0.0.1:8080",
  API_URL: "http://localhost:8080",
  DATABASE_URL: "postgres://portfolio:portfolio@127.0.0.1:5432/portfolio",
  AWS_ACCESS_KEY_ID: "test",
  AWS_SECRET_ACCESS_KEY: "test",
  AWS_REGION: "eu-north-1",
  AWS_ENDPOINT_URL: "http://127.0.0.1:4566",
  MEDIA_BUCKET: "portfolio-media-dev",
  MEDIA_PUBLIC_BASE_URL: "http://localhost:4566/portfolio-media-dev",
  ADMIN_TOKEN: "dev-admin-token",
  RECAPTCHA_SECRET_KEY: "",
  VITE_RECAPTCHA_SITE_KEY: "",
  VITE_HIDE_COOKIE_CONSENT: "true",
  VITE_SKIP_TUTORIAL: "true",
};

const preserveEnv = Object.keys(localDefaults).join(",");
const children = new Map<string, ChildProcess>();
let stopping = false;
const apiWatchPaths = [
  "Cargo.lock",
  "Cargo.toml",
  "apps/api/Cargo.toml",
  "apps/api/migrations",
  "apps/api/src",
  "apps/api/tests",
];
const apiWatchExtensions = new Set([".rs", ".sql", ".toml"]);

// `child.killed` only records that a signal was SENT, so it cannot be used
// as a liveness check; exitCode/signalCode stay null until the process dies.
function isAlive(child: ChildProcess): boolean {
  return child.exitCode === null && child.signalCode === null;
}

// Signal the child's whole process group: doppler does not forward SIGTERM,
// so signalling only its pid orphaned cargo + the api binary, which kept
// :8080 and silently served stale code. Falls back to a single-pid kill for
// children not spawned detached (no process group of their own).
function killTree(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid == null) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
}

function envWithDefaults(extra: Record<string, string> = {}) {
  const env = { ...process.env, ...extra };
  for (const [key, value] of Object.entries(localDefaults)) {
    if (!env[key]) env[key] = value;
  }
  return env;
}

function runSetup() {
  console.log("[dev] starting local db and localstack");
  const result = spawnSync("docker", ["compose", "up", "-d", "db", "localstack"], {
    cwd: root,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function apiIsHealthy() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(`${localDefaults.API_URL}/healthz`, {
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function seedDisabled() {
  return ["0", "false", "no"].includes((process.env.DEV_SEED_MEDIA ?? "").toLowerCase());
}

async function seedWhenApiIsReady(env: NodeJS.ProcessEnv) {
  if (seedDisabled()) {
    console.log("[dev] media seed disabled by DEV_SEED_MEDIA");
    return;
  }

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    if (await apiIsHealthy()) {
      console.log("[dev] seeding local media fixtures");
      const result = spawnSync("bun", ["scripts/seed-dev-media.ts"], {
        cwd: root,
        env,
        stdio: "inherit",
      });
      if (result.status !== 0) {
        console.warn(`[dev] media seed failed with code ${result.status ?? 1}; continuing`);
      }
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.warn("[dev] api did not become healthy before media seed timeout");
}

function start(name: string, command: string, args: string[], env: NodeJS.ProcessEnv) {
  console.log(`[dev] starting ${name}`);
  const child = spawn(command, args, {
    cwd: root,
    env,
    stdio: "inherit",
  });

  children.set(name, child);

  child.on("exit", (code, signal) => {
    children.delete(name);
    if (!stopping) {
      stopping = true;
      process.exitCode = code ?? 1;
      console.error(`[dev] ${name} exited${signal ? ` from ${signal}` : ` with code ${code}`}`);
      stopChildren("SIGTERM");
    }
    if (children.size === 0) {
      process.exit(process.exitCode ?? 0);
    }
  });

  child.on("error", (error) => {
    console.error(`[dev] failed to start ${name}:`, error);
    if (!stopping) {
      stopping = true;
      process.exitCode = 1;
      stopChildren("SIGTERM");
    }
  });
}

async function latestMtime(relativePath: string): Promise<number> {
  const absolutePath = path.join(root, relativePath);
  try {
    const info = await stat(absolutePath);
    if (info.isDirectory()) {
      const entries = await readdir(absolutePath, { withFileTypes: true });
      const childMtimes = await Promise.all(
        entries
          .filter((entry) => !entry.name.startsWith(".") && entry.name !== "target")
          .map((entry) => latestMtime(path.join(relativePath, entry.name))),
      );
      return Math.max(info.mtimeMs, ...childMtimes);
    }
    return apiWatchExtensions.has(path.extname(relativePath)) ? info.mtimeMs : 0;
  } catch {
    return 0;
  }
}

async function apiFingerprint() {
  const mtimes = await Promise.all(apiWatchPaths.map((watchPath) => latestMtime(watchPath)));
  return Math.max(0, ...mtimes);
}

function startWatchedApi(env: NodeJS.ProcessEnv) {
  let child: ChildProcess | null = null;
  let restarting = false;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;

  const launch = () => {
    console.log("[dev] starting api");
    child = spawn(
      "doppler",
      ["run", `--preserve-env=${preserveEnv}`, "--", "cargo", "run", "-p", "portfolio-api"],
      {
        cwd: root,
        env,
        stdio: "inherit",
        // Own process group so killTree can reach doppler's grandchildren.
        // Safe to detach: nothing in this tree reads stdin.
        detached: true,
      },
    );
    children.set("api", child);

    child.on("exit", (code, signal) => {
      children.delete("api");
      child = null;
      if (stopping) {
        if (children.size === 0) process.exit(process.exitCode ?? 0);
        return;
      }
      if (restarting) {
        restarting = false;
        launch();
        return;
      }
      console.error(
        `[dev] api exited${signal ? ` from ${signal}` : ` with code ${code}`}; waiting for file changes`,
      );
    });

    child.on("error", (error) => {
      children.delete("api");
      child = null;
      console.error("[dev] failed to start api:", error);
    });
  };

  const restart = () => {
    if (stopping) return;
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      console.log("[dev] api change detected; restarting");
      if (child && isAlive(child)) {
        restarting = true;
        const oldChild = child;
        killTree(oldChild, "SIGTERM");
        setTimeout(() => {
          if (isAlive(oldChild)) {
            killTree(oldChild, "SIGKILL");
          }
        }, 5000).unref();
      } else {
        launch();
      }
    }, 150);
  };

  launch();

  void (async () => {
    let previous = await apiFingerprint();
    setInterval(async () => {
      const next = await apiFingerprint();
      if (next > previous) {
        previous = next;
        restart();
      }
    }, 1000);
  })();
}

function stopChildren(signal: NodeJS.Signals) {
  for (const child of children.values()) {
    if (isAlive(child)) {
      killTree(child, signal);
    }
  }

  setTimeout(() => {
    for (const child of children.values()) {
      if (isAlive(child)) {
        killTree(child, "SIGKILL");
      }
    }
  }, 5000).unref();
}

function stop(signal: NodeJS.Signals) {
  if (stopping) return;
  stopping = true;
  process.exitCode = signal === "SIGINT" ? 130 : 143;
  // With no children left there is no exit event to finish the shutdown;
  // exiting here prevents zombie supervisors piling up across Ctrl+C's.
  if (children.size === 0) process.exit(process.exitCode);
  stopChildren(signal);
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

runSetup();

if (await apiIsHealthy()) {
  console.log(`[dev] using existing api at ${localDefaults.API_URL}`);
} else {
  startWatchedApi(envWithDefaults());
}

void seedWhenApiIsReady(envWithDefaults());

start(
  "web",
  "bun",
  ["run", "--filter", "@portfolio/web", "dev"],
  envWithDefaults({ API_URL: localDefaults.API_URL }),
);
