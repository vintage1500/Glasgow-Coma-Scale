import * as Crypto from "expo-crypto";
import { getFirst, run } from "../db/database";

function nowIso() {
  return new Date().toISOString();
}

export async function hashPassword(password) {
  // Для курсового достаточно SHA-256 (лучше, чем хранить plain text).
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function register({ email, name, password }) {
  const existing = getFirst("SELECT id FROM users WHERE email = ?", [email.trim().toLowerCase()]);
  if (existing) throw new Error("Пользователь с таким email уже существует");

  const password_hash = await hashPassword(password);
  run(
    "INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)",
    [email.trim().toLowerCase(), name.trim(), password_hash, nowIso()]
  );

  const user = getFirst("SELECT id, email, name FROM users WHERE email = ?", [email.trim().toLowerCase()]);
  run("UPDATE sessions SET user_id = ? WHERE id = 1", [user.id]);
  return user;
}

export async function login({ email, password }) {
  const userRow = getFirst("SELECT id, email, name, password_hash FROM users WHERE email = ?", [
    email.trim().toLowerCase(),
  ]);
  if (!userRow) throw new Error("Неверный email или пароль");

  const password_hash = await hashPassword(password);
  if (password_hash !== userRow.password_hash) throw new Error("Неверный email или пароль");

  run("UPDATE sessions SET user_id = ? WHERE id = 1", [userRow.id]);
  return { id: userRow.id, email: userRow.email, name: userRow.name };
}

export async function logout() {
  run("UPDATE sessions SET user_id = NULL WHERE id = 1");
}

export async function getCurrentUser() {
  const s = getFirst("SELECT user_id FROM sessions WHERE id = 1");
  if (!s?.user_id) return null;
  return getFirst("SELECT id, email, name FROM users WHERE id = ?", [s.user_id]);
}
