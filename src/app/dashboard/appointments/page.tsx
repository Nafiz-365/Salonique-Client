"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CustomerLayout } from "@/components/dashboard/CustomerLayout";
import { useAuth } from "@/context/AuthContext";
import { bffGet, bffPatch, ApiAppointment } from "@/lib/server-api";
import { formatPrice, formatDuration, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import {
    Calendar,
    Clock,
    MapPin,
    CreditCard,
    X,
    AlertCircle,
    Sparkles,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function MyAppointmentsPage() {
    const { user, isAuthenticated } = useAuth();
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("All");
    const [cancelModalItem, setCancelModalItem] =
        useState<ApiAppointment | null>(null);
    const [detailsItem, setDetailsItem] = useState<ApiAppointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filterTabs = [
        "All",
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
    ];

    useEffect(() => {
        if (!isAuthenticated || !user?.email) return;
        bffGet<{ appointments: ApiAppointment[] }>(
            `/my-appointments/${encodeURIComponent(user.email)}`,
        )
            .then((data) => setAppointments(data.appointments ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, [user?.email, isAuthenticated]);

    const filtered = appointments.filter((apt) => {
        if (selectedFilter === "All") return true;
        return apt.status.toLowerCase() === selectedFilter.toLowerCase();
    });

    const confirmCancel = async () => {
        if (!cancelModalItem) return;
        setIsCancelling(true);
        try {
            await bffPatch(`/appointment/${cancelModalItem._id}/cancel`);
            setAppointments((prev) =>
                prev.map((a) =>
                    a._id === cancelModalItem._id
                        ? { ...a, status: "cancelled" }
                        : a,
                ),
            );
            setCancelModalItem(null);
            toast.success("Appointment has been cancelled");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to cancel",
            );
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="space-y-6">
                {/* Header & Filter Tabs */}
                <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between sm:p-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-neutral-900">
                            My Appointments
                        </h2>
                        <p className="text-xs text-neutral-500">
                            Manage your upcoming sessions, reschedule or make
                            secure payments
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 md:flex-nowrap md:justify-end">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setSelectedFilter(tab)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                    selectedFilter === tab
                                        ? "bg-neutral-900 text-white shadow-xs"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error.toLowerCase().includes("unauthorized") ||
                        error.toLowerCase().includes("session")
                            ? "Your session has expired. Please sign out and sign in again."
                            : `Notice: ${error}`}
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="space-y-4">
                        {filtered.map((apt, index) => (
                            <div
                                key={apt._id}
                                className="space-y-4 rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-xs transition-all hover:border-neutral-300 sm:p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                apt.status === "confirmed"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : apt.status === "pending"
                                                      ? "bg-amber-100 text-amber-800"
                                                      : apt.status ===
                                                          "completed"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-neutral-100 text-neutral-500"
                                            }`}
                                        >
                                            {apt.status}
                                        </span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                apt.paymentStatus === "paid"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                        >
                                            {apt.paymentStatus === "paid"
                                                ? "Paid"
                                                : "Payment Pending"}
                                        </span>
                                    </div>
                                    <span className="text-xs text-neutral-400">
                                        Booking ID:{" "}
                                        <strong className="text-neutral-700">
                                            {apt._id}
                                        </strong>
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <Image
                                            src={
                                                apt.serviceImage ||
                                                "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"
                                            }
                                            alt={apt.serviceName}
                                            width={80}
                                            height={80}
                                            unoptimized
                                            loading={
                                                index === 0 ? "eager" : "lazy"
                                            }
                                            className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                                        />
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <span className="text-[11px] font-bold text-neutral-500 uppercase">
                                                {apt.serviceCategory}
                                            </span>
                                            <h4 className="wrap-break-word text-base font-bold text-neutral-900">
                                                {apt.serviceName}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-1">
                                                <span className="flex items-center gap-1 font-semibold text-neutral-900">
                                                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                                                    {formatDate(apt.date)} at{" "}
                                                    {apt.time}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                                    {formatDuration(
                                                        apt.serviceDuration,
                                                    )}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                                    {apt.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                                        <div className="text-left md:text-right">
                                            <span className="text-xs text-neutral-400 block">
                                                Total
                                            </span>
                                            <span className="text-xl font-extrabold text-neutral-900">
                                                {formatPrice(apt.servicePrice)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDetailsItem(apt)
                                                }
                                                className="px-3 py-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold transition-colors"
                                            >
                                                Details
                                            </button>
                                            {apt.paymentStatus === "unpaid" &&
                                                apt.status === "confirmed" && (
                                                    <CheckoutButton
                                                        appointmentId={apt._id}
                                                        className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                                                    >
                                                        <CreditCard className="w-3.5 h-3.5" />
                                                        <span>Pay Now</span>
                                                    </CheckoutButton>
                                                )}
                                            {apt.paymentStatus === "unpaid" &&
                                                apt.status === "pending" && (
                                                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                                        Awaiting Confirmation
                                                    </span>
                                                )}
                                            {apt.status === "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCancelModalItem(apt)
                                                    }
                                                    className="px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xs space-y-4">
                        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            No appointments found
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                            You don&apos;t have any appointments under &ldquo;
                            {selectedFilter}&rdquo;.
                        </p>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                            <span>Browse Services</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Appointment Details Dialog */}
            <Dialog
                open={!!detailsItem}
                onOpenChange={(open) => {
                    if (!open) setDetailsItem(null);
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                        <DialogDescription>
                            Full information about this booking request.
                        </DialogDescription>
                    </DialogHeader>
                    {detailsItem && (
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={
                                        detailsItem.serviceImage ||
                                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"
                                    }
                                    alt={detailsItem.serviceName}
                                    width={72}
                                    height={72}
                                    unoptimized
                                    className="w-18 h-18 rounded-2xl object-cover border border-neutral-200"
                                />
                                <div>
                                    <span className="text-[11px] font-bold text-neutral-500 uppercase">
                                        {detailsItem.serviceCategory}
                                    </span>
                                    <h4 className="text-base font-bold text-neutral-900">
                                        {detailsItem.serviceName}
                                    </h4>
                                    <p className="text-xs text-neutral-500">
                                        Booking ID: {detailsItem._id}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Status
                                    </span>
                                    <span className="text-sm font-bold capitalize">
                                        {detailsItem.status}
                                    </span>
                                </div>
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Payment
                                    </span>
                                    <span className="text-sm font-bold capitalize">
                                        {detailsItem.paymentStatus}
                                    </span>
                                </div>
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Appointment Date
                                    </span>
                                    <span className="text-sm font-bold">
                                        {formatDate(detailsItem.date)} at{" "}
                                        {detailsItem.time}
                                    </span>
                                </div>
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Service Price
                                    </span>
                                    <span className="text-sm font-bold">
                                        {formatPrice(detailsItem.servicePrice)}
                                    </span>
                                </div>
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Duration
                                    </span>
                                    <span className="text-sm font-bold">
                                        {formatDuration(
                                            detailsItem.serviceDuration,
                                        )}
                                    </span>
                                </div>
                                <div className="rounded-xl bg-neutral-50 p-3">
                                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
                                        Requested On
                                    </span>
                                    <span className="text-sm font-bold">
                                        {formatDate(detailsItem.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {detailsItem.notes && (
                                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                                    <span className="text-[11px] font-semibold text-amber-700 uppercase block">
                                        Your Message
                                    </span>
                                    <p className="text-sm text-amber-900 mt-1">
                                        {detailsItem.notes}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={() => setDetailsItem(null)}
                                    className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation Modal */}
            {cancelModalItem && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md space-y-5 overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 sm:p-7">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setCancelModalItem(null)}
                                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">
                                Cancel this appointment?
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                                Are you sure you want to cancel your appointment
                                for{" "}
                                <strong className="text-neutral-800">
                                    {cancelModalItem.serviceName}
                                </strong>{" "}
                                on {formatDate(cancelModalItem.date)}? This
                                action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setCancelModalItem(null)}
                                className="w-1/2 py-2.5 rounded-full border border-neutral-300 font-semibold text-xs text-neutral-700 hover:bg-neutral-50"
                            >
                                Keep Booking
                            </button>
                            <button
                                type="button"
                                onClick={confirmCancel}
                                disabled={isCancelling}
                                className="w-1/2 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                        Cancelling...
                                    </>
                                ) : (
                                    "Yes, Cancel"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
