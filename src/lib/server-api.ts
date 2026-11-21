/**
 * server-api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Public (unauthenticated) API helpers — these call the Express backend
 * directly for read-only public data (services listing, featured, single).
 *
 * Protected actions (booking, appointments, admin ops) go through the BFF
 * proxy at /api/backend/* so the server-side JWT is attached automatically.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ─── Types returned by Express ─────────────────────────────────────────────

export interface ApiService {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  isActive: boolean;
  featured: boolean;
  popular: boolean;
  specialist: { name: string; role: string; avatar: string; rating: number };
  location: string;
  included: string[];
}

export interface ApiAppointment {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  servicePrice: number;
  serviceDuration: number;
  serviceImage: string;
  date: string;
  time: string;
  specialist: string;
  location: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

export interface ApiTransaction {
  _id: string;
  appointmentId: string;
  appointmentDate?: string;
  stripeSessionId?: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  amount: number;
  currency?: string;
  status: "paid" | "failed" | "succeeded" | "pending" | "refunded";
  paymentMethod: string;
  date: string;
}

export interface ServicesResponse {
  services: ApiService[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Public helpers ────────────────────────────────────────────────────────

export async function fetchServices(params?: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  location?: string;
}): Promise<ServicesResponse> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.location) qs.set("location", params.location);

  const url = `${API_BASE}/services${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function fetchFeaturedServices(): Promise<ApiService[]> {
  const res = await fetch(`${API_BASE}/featured-services`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch featured services");
  const data = await res.json();
  return data.services ?? data;
}

export async function fetchService(id: string): Promise<ApiService | null> {
  try {
    const res = await fetch(`${API_BASE}/service/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.service ?? data;
  } catch {
    return null;
  }
}

// ─── BFF proxy helpers (authenticated) ────────────────────────────────────

const BFF = "/api/backend";

export async function bffGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BFF}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `GET ${path} failed`);
  }
  return res.json();
}

export async function bffPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BFF}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `POST ${path} failed`);
  }
  return res.json();
}

export async function bffPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BFF}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `PATCH ${path} failed`);
  }
  return res.json();
}

export async function bffDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${BFF}${path}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `DELETE ${path} failed`);
  }
  return res.json();
}
