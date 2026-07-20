import { apiFetch } from "./client";

export function signup({ name, email, password }) {
  return apiFetch("/api/auth/signup", { method: "POST", body: { name, email, password } });
}

export function login({ email, password }) {
  return apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
}

export function me(token) {
  return apiFetch("/api/auth/me", { token });
}
