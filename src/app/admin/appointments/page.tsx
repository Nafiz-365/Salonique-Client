"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { bffGet, bffPatch, ApiAppointment } from "@/lib/server-api";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
    Search,
    X,
    Loader2,
    AlertCircle,
    Calendar,
    CheckCircle,
    XCircle,
    Eye,
    MessageSquare,
    Clock,
    User,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] =
        useState<ApiAppointment | null>(null);

    useEffect(() => {
        bffGet<{ appointments: ApiAppointment[] }>("/all-appointments")
            .then((data) => setAppointments(data.appointments ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = appointments.filter((apt) => {
        const matchesQ =
            apt.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" ||
            apt.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesQ && matchesStatus;
    });

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            await bffPatch(`/appointment/${id}/status`, { status: newStatus });
            setAppointments((prev) =>
                prev.map((a) =>
                    a._id === id
                        ? {
                              ...a,
                              status: newStatus as ApiAppointment["status"],
                          }
                        : a,
                ),
            );
            toast.success(`Appointment status updated to ${newStatus}`);
            if (selectedAppointment?._id === id) {
                setSelectedAppointment((prev) =>
                    prev
                        ? {
                              ...prev,
                              status: newStatus as ApiAppointment["status"],
                          }
                        : null,
                );
            }
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update status",
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                            Manage Appointments
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1">
                            Review incoming requests, confirm pending
                            appointments, or cancel
                        </p>
                    </div>
                    <div className="text-xs font-semibold text-neutral-500 bg-white border border-neutral-200 px-4 py-2 rounded-full">
                        {filtered.length} of {appointments.length} appointments
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error} — start the Express server.
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:gap-4">
                    <div className="relative w-full min-w-0 lg:w-80 lg:shrink-0">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by customer or service..."
                            className="h-10 pl-9 pr-8 text-xs font-medium sm:text-sm"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear appointment search"
                                className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>

                    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:flex-1">
                        {["All", "pending", "confirmed", "cancelled"].map(
                            (s) => (
                                <Button
                                    variant={
                                        statusFilter === s
                                            ? "default"
                                            : "secondary"
                                    }
                                    size="sm"
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    className={`h-8 rounded-xl px-3 text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                                        statusFilter === s
                                            ? "bg-neutral-900 text-white"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    }`}
                                >
                                    {s}
                                </Button>
                            ),
                        )}
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto w-full ">
                            <table className="w-full min-w-205 text-left text-xs">
                                <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-6 align-middle">
                                            Customer
                                        </th>
                                        <th className="py-3.5 px-6 align-middle">
                                            Service
                                        </th>
                                        <th className="py-3.5 px-6 align-middle whitespace-nowrap">
                                            Date & Time
                                        </th>
                                        <th className="py-3.5 px-6 align-middle">
                                            Price
                                        </th>
                                        <th className="py-3.5 px-6 align-middle">
                                            Status
                                        </th>
                                        <th className="py-3.5 px-6 align-middle">
                                            Payment
                                        </th>
                                        <th className="py-3.5 px-6 align-middle text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-100">
                                    {filtered.map((apt) => (
                                        <tr
                                            key={apt._id}
                                            className="hover:bg-neutral-50/50 transition-colors"
                                        >
                                            {/* Customer */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-neutral-900 whitespace-nowrap">
                                                        {apt.userName}
                                                    </p>
                                                    <p className="text-neutral-400 text-[11px] truncate max-w-45">
                                                        {apt.userEmail}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Service */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-neutral-800 whitespace-nowrap">
                                                        {apt.serviceName}
                                                    </p>
                                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                                        {apt.serviceCategory}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-6 align-middle text-neutral-600 whitespace-nowrap">
                                                <p>{formatDate(apt.date)}</p>
                                                <span className="block text-neutral-400 text-[11px]">
                                                    {apt.time}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6 align-middle font-bold text-neutral-900 whitespace-nowrap">
                                                {formatPrice(apt.servicePrice)}
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6 align-middle">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase whitespace-nowrap ${
                                                        apt.status ===
                                                        "confirmed"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : apt.status ===
                                                                "pending"
                                                              ? "bg-amber-100 text-amber-800"
                                                              : "bg-neutral-100 text-neutral-500"
                                                    }`}
                                                >
                                                    {apt.status}
                                                </span>
                                            </td>

                                            {/* Payment */}
                                            <td className="py-4 px-6 align-middle">
                                                <span
                                                    className={`text-[11px] font-semibold whitespace-nowrap ${
                                                        apt.paymentStatus ===
                                                        "paid"
                                                            ? "text-emerald-700"
                                                            : "text-amber-700"
                                                    }`}
                                                >
                                                    {apt.paymentStatus ===
                                                    "paid"
                                                        ? "Paid"
                                                        : "Unpaid"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    {updatingId === apt._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedAppointment(
                                                                        apt,
                                                                    )
                                                                }
                                                                aria-label={`View ${apt.userName}'s appointment`}
                                                                title="View Details"
                                                                className="size-8 shrink-0 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </Button>

                                                            {apt.status ===
                                                                "pending" && (
                                                                <Button
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            apt._id,
                                                                            "confirmed",
                                                                        )
                                                                    }
                                                                    className="h-8 shrink-0 gap-1 rounded-lg bg-emerald-600 px-2.5 text-[11px] font-semibold text-white shadow-xs hover:bg-emerald-700"
                                                                    title="Confirm Appointment"
                                                                >
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    Confirm
                                                                </Button>
                                                            )}

                                                            {(apt.status ===
                                                                "pending" ||
                                                                apt.status ===
                                                                    "confirmed") && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            apt._id,
                                                                            "cancelled",
                                                                        )
                                                                    }
                                                                    className="h-8 shrink-0 gap-1 rounded-lg border-rose-200 px-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                                                                    title="Cancel Appointment"
                                                                >
                                                                    <XCircle className="w-3 h-3" />
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filtered.length === 0 && (
                                <div className="py-16 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-neutral-500">
                                        No appointments found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Dialog
                    open={selectedAppointment !== null}
                    onOpenChange={(open) => {
                        if (!open) setSelectedAppointment(null);
                    }}
                >
                    {selectedAppointment && (
                        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl p-4 sm:max-w-lg sm:p-6">
                            <DialogHeader className="border-b border-neutral-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-neutral-900" />
                                    <DialogTitle className="text-base font-bold text-neutral-900">
                                        Appointment Details
                                    </DialogTitle>
                                </div>
                                <DialogDescription className="sr-only">
                                    Appointment and customer details for{" "}
                                    {selectedAppointment.serviceName}.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 text-xs">
                                {/* Customer Information */}
                                <div className="p-3.5 rounded-2xl bg-neutral-50 space-y-1.5 border border-neutral-200/80">
                                    <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                                        Customer Information
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-neutral-500" />
                                        <span className="font-bold text-neutral-900 text-sm">
                                            {selectedAppointment.userName}
                                        </span>
                                    </div>
                                    <p className="text-neutral-600 pl-5.5">
                                        {selectedAppointment.userEmail}
                                    </p>
                                    {selectedAppointment.userPhone && (
                                        <p className="text-neutral-600 pl-5.5">
                                            {selectedAppointment.userPhone}
                                        </p>
                                    )}
                                </div>

                                {/* Service Information */}
                                <div className="p-3.5 rounded-2xl bg-neutral-50 space-y-1.5 border border-neutral-200/80">
                                    <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                                        Service & Schedule
                                    </span>
                                    <p className="font-bold text-neutral-900 text-sm">
                                        {selectedAppointment.serviceName}
                                    </p>
                                    <p className="text-neutral-500">
                                        Category:{" "}
                                        {selectedAppointment.serviceCategory} •
                                        Specialist:{" "}
                                        {selectedAppointment.specialist}
                                    </p>
                                    <div className="flex items-center gap-3 pt-1 text-neutral-700">
                                        <span className="flex items-center gap-1 font-semibold text-neutral-900">
                                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                            {formatDate(
                                                selectedAppointment.date,
                                            )}{" "}
                                            at {selectedAppointment.time}
                                        </span>
                                        <span>•</span>
                                        <span className="font-bold text-neutral-900">
                                            {formatPrice(
                                                selectedAppointment.servicePrice,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Message */}
                                {selectedAppointment.notes && (
                                    <div className="p-3.5 rounded-2xl bg-neutral-50 space-y-1 border border-neutral-200/80">
                                        <div className="flex items-center gap-1.5 text-neutral-600">
                                            <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                                            <span className="font-bold text-neutral-700">
                                                Customer Message:
                                            </span>
                                        </div>
                                        <p className="text-neutral-800 italic pl-5">
                                            &ldquo;{selectedAppointment.notes}
                                            &rdquo;
                                        </p>
                                    </div>
                                )}

                                {/* Status & Payment */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border border-neutral-200 space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                                            Appointment Status
                                        </span>
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                selectedAppointment.status ===
                                                "confirmed"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : selectedAppointment.status ===
                                                        "pending"
                                                      ? "bg-amber-100 text-amber-800"
                                                      : "bg-neutral-100 text-neutral-600"
                                            }`}
                                        >
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl border border-neutral-200 space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                                            Payment Status
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                selectedAppointment.paymentStatus ===
                                                "paid"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            <CreditCard className="w-3 h-3" />
                                            {selectedAppointment.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Request Date */}
                                <div className="text-[11px] text-neutral-400 text-center pt-2">
                                    Request Date:{" "}
                                    {new Date(
                                        selectedAppointment.createdAt,
                                    ).toLocaleString()}
                                </div>
                            </div>

                            {/* Action in Modal */}
                            <DialogFooter className="border-t border-neutral-100 pt-3">
                                {selectedAppointment.status === "pending" && (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedAppointment._id,
                                                "confirmed",
                                            )
                                        }
                                        className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                                    >
                                        Confirm Appointment
                                    </Button>
                                )}
                                {(selectedAppointment.status === "pending" ||
                                    selectedAppointment.status ===
                                        "confirmed") && (
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedAppointment._id,
                                                "cancelled",
                                            )
                                        }
                                        className="h-9 rounded-xl border-rose-200 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50"
                                    >
                                        Cancel Appointment
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => setSelectedAppointment(null)}
                                    className="h-9 rounded-xl px-4 text-xs font-semibold"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </AdminLayout>
    );
}
