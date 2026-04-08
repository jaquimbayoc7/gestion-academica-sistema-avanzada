// ============================================================
// Smoke tests — helpers compartidos
// ============================================================
const BASE = process.env.API_URL ?? "http://localhost:3001/api/v1";

export async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, body: await res.json() };
}

export async function post(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: res.status, body: await res.json() };
}

export async function put(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: res.status, body: await res.json() };
}

export async function del(path) {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
}

export function assertStatus(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`[${label}] esperado HTTP ${expected}, recibido ${actual}`);
  }
}

export function assertField(obj, field, label) {
  if (obj?.[field] === undefined) {
    throw new Error(`[${label}] campo '${field}' no encontrado en la respuesta`);
  }
}
