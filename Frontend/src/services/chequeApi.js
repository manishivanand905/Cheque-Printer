const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const AUTH_STORAGE_KEY = "cheque_printer_auth";

function getStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function getAuthToken() {
  return getStoredAuth()?.token || "";
}

export function setStoredAuth(auth) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function readStoredAuth() {
  return getStoredAuth();
}

async function request(path, options = {}) {
  if (typeof fetch !== "function") {
    throw new Error("Fetch is not available in this environment.");
  }

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const rawBody = await response.text();
  const body = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed.");
  }

  return body;
}

export async function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser() {
  return request("/auth/me");
}

export async function requestPasswordResetOtp(payload) {
  return request("/auth/forgot-password/request-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPasswordWithOtp(payload) {
  return request("/auth/forgot-password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchChequeHistory() {
  return request("/cheques");
}

export async function saveChequeRecord(record) {
  return request("/cheques", {
    method: "POST",
    body: JSON.stringify(record),
  });
}

export async function saveBulkChequeRecords(records) {
  return request("/cheques/bulk", {
    method: "POST",
    body: JSON.stringify({ records }),
  });
}
