const TOKEN_KEY = "htl_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { cache: "no-store", ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "The studio could not be reached");
  }
  return data;
}

export function whatsappHref(number, text) {
  const digits = String(number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function instagramHref(handle) {
  const name = String(handle || "").replace(/^@/, "");
  return `https://instagram.com/${name}`;
}

export function bookingText(serviceName) {
  if (serviceName) {
    return `Hello Maria, I would like to book ${serviceName}.`;
  }
  return "Hello Maria, I would like to book an appointment at HTLSTUDIO.";
}
