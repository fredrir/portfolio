import fs from "node:fs";

const trim = (path) =>
  typeof path === "string" && path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;

const wrap =
  (rm) =>
  (path, ...rest) =>
    rm(trim(path), ...rest);

fs.rm = wrap(fs.rm);
fs.rmSync = wrap(fs.rmSync);
fs.promises.rm = wrap(fs.promises.rm);
