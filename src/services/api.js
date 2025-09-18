// Detect environment for universal proxy URL
const isNetlify = window.location.hostname.includes("netlify.app");
export const DEPLOY_URL = isNetlify
  ? "/.netlify/functions/proxy"
  : "/api/proxy"; // Vercel default

// === Generic POST request helper ===
async function apiRequest(action, payload = {}) {
  const res = await fetch(DEPLOY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  return res.json();
}

// === Vendor Authentication ===
export async function registerVendor(vendor) {
  // vendor = { email, password, name, logo, phone }
  return apiRequest("registerVendor", vendor);
}

export async function loginVendor(vendor) {
  // vendor = { email, password }
  return apiRequest("loginVendor", vendor);
}

// === Products ===
export async function fetchProducts(vendorEmail = null) {
  // Always use POST to avoid CORS issues
  const payload = { action: "getProducts" };
  if (vendorEmail) payload.vendorEmail = vendorEmail;

  return apiRequest("getProducts", payload);
}

export async function addProduct(product) {
  // product = { title, price, image, vendorEmail, vendorName, vendorPhone, vendorLogo }
  return apiRequest("addProduct", product);
}

export async function editProduct(product) {
  // product = { id, title, price, image }
  return apiRequest("editProduct", product);
}

export async function deleteProduct(id) {
  return apiRequest("deleteProduct", { id });
}

// === Orders ===
export async function placeOrder(order) {
  // order = { name, email, phone, address, items, total, paymentRef }
  return apiRequest("placeOrder", order);
}
