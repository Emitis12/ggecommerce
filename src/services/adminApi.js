import axios from "axios";

// ===== Base API URL =====
const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.MODE === "production"
    ? "https://ggbackend-bhs5.onrender.com/api" // hosted backend
    : "http://localhost:3002/api"); // local backend

// ===== Token Helpers =====
export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function setAdminToken(token) {
  if (token) localStorage.setItem("adminToken", token);
}

export function removeAdminToken() {
  localStorage.removeItem("adminToken");
}

// ===== Auth Headers =====
function getAuthHeaders() {
  const token = getAdminToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
}

// ===== Interceptor (Auto Logout on 401) =====
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeAdminToken();
      window.location.href = "/"; // force re-login
    }
    return Promise.reject(error);
  }
);

// ===== Admin Authentication =====
export async function loginAdmin(credentials) {
  try {
    const res = await axios.post(`${API_URL}/admin/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data?.token) {
      setAdminToken(res.data.token);
    }

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
}

export function logoutAdmin() {
  removeAdminToken();
}

// ===== Vendors =====
export async function fetchAllVendors() {
  try {
    const res = await axios.get(`${API_URL}/admin/vendors`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("fetchAllVendors error:", err);
    return { success: false, message: err.response?.data?.message || "Failed to fetch vendors" };
  }
}

export async function updateVendorStatus(vendorId, status) {
  try {
    const res = await axios.patch(
      `${API_URL}/admin/vendors/${vendorId}`,
      { status },
      getAuthHeaders()
    );
    return res.data;
  } catch (err) {
    console.error("updateVendorStatus error:", err);
    return { success: false, message: err.response?.data?.message || "Failed to update vendor status" };
  }
}

// ===== Products =====
export async function fetchAllProducts() {
  try {
    const res = await axios.get(`${API_URL}/admin/products`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("fetchAllProducts error:", err);
    return { success: false, message: err.response?.data?.message || "Failed to fetch products" };
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await axios.delete(`${API_URL}/admin/products/${productId}`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("deleteProduct error:", err);
    return { success: false, message: err.response?.data?.message || "Failed to delete product" };
  }
}

// ===== Orders =====
export async function fetchAllOrders() {
  try {
    const res = await axios.get(`${API_URL}/admin/orders`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("fetchAllOrders error:", err);
    return { success: false, message: err.response?.data?.message || "Failed to fetch orders" };
  }
}

// ===== Auth Guard =====
export function isAdminAuthenticated() {
  return !!getAdminToken();
}
