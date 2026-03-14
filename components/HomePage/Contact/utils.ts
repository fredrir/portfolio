export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function genQueueId() {
  const chars = "0123456789ABCDEF";
  let id = "";
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

export function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
