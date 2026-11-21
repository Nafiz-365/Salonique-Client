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

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<ApiAppointment | null>(null);

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
          a._id === id ? { ...a, status: newStatus as ApiAppointment["status"] } : a
        )
      );
      toast.success(`Appointment status updated to ${newStatus}`);
      if (selectedAppointment?._id === id) {
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: newStatus as ApiAppointment["status"] } : null
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
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
              Review incoming requests, confirm pending appointments, or cancel
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
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer or service..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["All", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === s
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Service</th>
                    <th className="py-3.5 px-6">Date & Time</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Payment</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((apt) => (
                    <tr key={apt._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-neutral-900">{apt.userName}</p>
                        <p className="text-neutral-400 text-[11px]">{apt.userEmail}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-neutral-800">{apt.serviceName}</p>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          {apt.serviceCategory}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-neutral-600">
                        {formatDate(apt.date)}
                        <span className="block text-neutral-400 text-[11px]">{apt.time}</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-neutral-900">
                        {formatPrice(apt.servicePrice)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                            apt.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : apt.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : apt.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-semibold ${
                            apt.paymentStatus === "paid"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {apt.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {updatingId === apt._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-400 ml-auto" />
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Details Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedAppointment(apt)}
                              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Only Pending can be confirmed */}
                            {apt.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(apt._id, "confirmed")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                                title="Confirm Appointment"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Confirm</span>
                              </button>
                            )}

                            {/* Cancel Pending or Confirmed */}
                            {(apt.status === "pending" || apt.status === "confirmed") && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(apt._id, "cancelled")}
                                className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] flex items-center gap-1"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>
                        )}
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
                  <p className="text-sm text-neutral-500">No appointments found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Appointment Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                  <p className="text-neutral-600 pl-5.5">{selectedAppointment.userEmail}</p>
                  {selectedAppointment.userPhone && (
                    <p className="text-neutral-600 pl-5.5">{selectedAppointment.userPhone}</p>
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
                    Category: {selectedAppointment.serviceCategory} • Specialist: {selectedAppointment.specialist}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-neutral-700">
                    <span className="flex items-center gap-1 font-semibold text-neutral-900">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-neutral-900">
                      {formatPrice(selectedAppointment.servicePrice)}
                    </span>
                  </div>
                </div>

                {/* Customer Message */}
                {selectedAppointment.notes && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 space-y-1 border border-neutral-200/80">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-bold text-neutral-700">Customer Message:</span>
                    </div>
                    <p className="text-neutral-800 italic pl-5">
                      &ldquo;{selectedAppointment.notes}&rdquo;
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
                        selectedAppointment.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedAppointment.status === "pending"
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
                        selectedAppointment.paymentStatus === "paid"
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
                  Request Date: {new Date(selectedAppointment.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Action in Modal */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                {selectedAppointment.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAppointment._id, "confirmed")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Confirm Appointment
                  </button>
                )}
                {(selectedAppointment.status === "pending" || selectedAppointment.status === "confirmed") && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAppointment._id, "cancelled")}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                  >
                    Cancel Appointment
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
