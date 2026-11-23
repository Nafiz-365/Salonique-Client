export type CategoryType =
    | "Hair"
    | "Nails"
    | "Facial"
    | "Massage"
    | "Makeup"
    | "Brows & Lashes"
    | "Waxing"
    | "Spa";

export interface Specialist {
    name: string;
    role: string;
    avatar: string;
    rating: number;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    category: CategoryType;
    price: number;
    duration: number; // in minutes
    rating: number;
    reviewCount: number;
    description: string;
    shortDescription: string;
    image: string;
    gallery: string[];
    isActive: boolean;
    featured: boolean;
    popular: boolean;
    specialist: Specialist;
    location: string;
    included: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "admin";
    avatar: string;
    phone: string;
    memberSince: string;
    status: "active" | "suspended";
}

export type AppointmentStatus =
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Appointment {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    serviceId: string;
    serviceName: string;
    serviceCategory: CategoryType;
    servicePrice: number;
    serviceDuration: number;
    serviceImage: string;
    date: string; // YYYY-MM-DD
    time: string; // e.g. "10:00 AM"
    specialist: string;
    location: string;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    notes?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    date: string;
    comment: string;
    serviceName: string;
    verified: boolean;
}

export interface Transaction {
    id: string;
    appointmentId: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    amount: number;
    status: "paid" | "failed" | "succeeded" | "pending" | "refunded";
    paymentMethod: string;
    date: string;
}
