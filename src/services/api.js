// ====================
// Detect environment
// ====================
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/https://ggbackend-bhs5.onrender.com/api" // <-- change after deploying backend
    : "http://localhost:3002/api";

// ====================
// Token Helpers
// ====================
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

// ====================
// Generic request helper
// ====================
async function apiRequest(endpoint, method = "POST", payload = null) {
  const token = getToken();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (payload) options.body = JSON.stringify(payload);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${endpoint} failed: ${res.status} - ${text}`);
  }

  return res.json();
}

// ====================
// Vendor Authentication
// ====================
export async function registerVendor(vendor) {
  // vendor = { email, password, name, logo, phone }
  return apiRequest("/auth/register", "POST", vendor);
}

export async function loginVendor(vendor) {
  // vendor = { email, password }
  const data = await apiRequest("/auth/login", "POST", vendor);

  if (data.success && data.token) {
    setToken(data.token); // ✅ store token
  }

  return data;
}

export function logoutVendor() {
  clearToken();
}

export function getCurrentVendor() {
  return getToken(); // if null => not logged in
}

// ====================
// Products
// ====================
export async function fetchProducts(vendorEmail = null) {
  const url = vendorEmail
    ? `/products?vendorEmail=${encodeURIComponent(vendorEmail)}`
    : "/products";
  return apiRequest(url, "GET");
}

export async function addProduct(product) {
  return apiRequest("/products", "POST", product);
}

export async function editProduct(product) {
  return apiRequest(`/products/${product.id}`, "PUT", product);
}

export async function deleteProduct(id) {
  return apiRequest(`/products/${id}`, "DELETE");
}

// ====================
// Orders
// ====================
export async function placeOrder(order) {
  return apiRequest("/orders", "POST", order);
}
