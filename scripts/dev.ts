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
      },
    );
    children.set("api", child);

    child.on("exit", (code, signal) => {
      children.delete("api");
      child = null;
      if (stopping) return;
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
      if (child && child.exitCode === null && !child.killed) {
        restarting = true;
        const oldChild = child;
        oldChild.kill("SIGTERM");
        setTimeout(() => {
          if (oldChild.exitCode === null && !oldChild.killed) {
            oldChild.kill("SIGKILL");
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
    if (child.exitCode === null && !child.killed) {
      child.kill(signal);
    }
  }

  setTimeout(() => {
    for (const child of children.values()) {
      if (child.exitCode === null && !child.killed) {
        child.kill("SIGKILL");
      }
    }
  }, 5000).unref();
}

function stop(signal: NodeJS.Signals) {
  if (stopping) return;
  stopping = true;
  process.exitCode = signal === "SIGINT" ? 130 : 143;
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

start(
  "web",
  "bun",
  ["run", "--filter", "@portfolio/web", "dev"],
  envWithDefaults({ API_URL: localDefaults.API_URL }),
);
