"use client";

/**
 * Lazily-loaded WebAssembly terminal plugins. The module is fetched and
 * instantiated on first use and cached; commands run synchronously against
 * a linear-memory string ABI (alloc + run -> packed ptr/len).
 */

interface PluginExports {
  memory: WebAssembly.Memory;
  alloc(len: number): number;
  run(cmdPtr: number, cmdLen: number, argPtr: number, argLen: number): bigint;
}

let instancePromise: Promise<PluginExports> | null = null;

async function instantiate(): Promise<PluginExports> {
  const response = await fetch("/wasm/terminal-plugins.wasm");
  if (!response.ok) throw new Error(`wasm fetch failed: ${response.status}`);
  try {
    const result = await WebAssembly.instantiateStreaming(response.clone(), {});
    return result.instance.exports as unknown as PluginExports;
  } catch {
    // instantiateStreaming rejects when the server sends the wrong MIME type;
    // fall back to buffering the bytes and compiling from an ArrayBuffer.
    const bytes = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(bytes, {});
    return result.instance.exports as unknown as PluginExports;
  }
}

async function loadPlugins(): Promise<PluginExports> {
  if (!instancePromise) {
    instancePromise = instantiate();
    instancePromise.catch(() => {
      instancePromise = null;
    });
  }
  return instancePromise;
}

function writeString(exports: PluginExports, value: string): [number, number] {
  const bytes = new TextEncoder().encode(value);
  const ptr = exports.alloc(bytes.length);
  new Uint8Array(exports.memory.buffer, ptr, bytes.length).set(bytes);
  return [ptr, bytes.length];
}

export async function runWasmCommand(command: string, args: string): Promise<string> {
  const exports = await loadPlugins();
  const [cmdPtr, cmdLen] = writeString(exports, command);
  const [argPtr, argLen] = writeString(exports, args);
  const packed = exports.run(cmdPtr, cmdLen, argPtr, argLen);
  const outPtr = Number(packed >> 32n);
  const outLen = Number(packed & 0xffffffffn);
  return new TextDecoder().decode(new Uint8Array(exports.memory.buffer, outPtr, outLen));
}
