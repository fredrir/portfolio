import { type ChildProcess, spawn, spawnSync } from "node:child_process";
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
};

const preserveEnv = Object.keys(localDefaults).join(",");
const children = new Map<string, ChildProcess>();
let stopping = false;

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
  start(
    "api",
    "doppler",
    ["run", `--preserve-env=${preserveEnv}`, "--", "cargo", "run", "-p", "portfolio-api"],
    envWithDefaults(),
  );
}

start(
  "web",
  "bun",
  ["run", "--filter", "@portfolio/web", "dev"],
  envWithDefaults({ API_URL: localDefaults.API_URL }),
);
