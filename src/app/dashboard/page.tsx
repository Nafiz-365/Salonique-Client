"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CustomerLayout } from "@/components/dashboard/CustomerLayout";
import { useAuth } from "@/context/AuthContext";
import { bffGet, bffPatch, ApiAppointment } from "@/lib/server-api";
import { formatPrice, formatDuration, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CreditCard,
  ArrowRight,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    setIsLoading(true);
    bffGet<{ appointments: ApiAppointment[] }>(`/my-appointments/${encodeURIComponent(user.email)}`)
      .then((data) => setAppointments(data.appointments ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [user?.email, isAuthenticated]);

  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;
  const nextUpcoming = appointments.find(
    (a) => a.status === "confirmed" || a.status === "pending"
  );

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending appointment?")) return;
    try {
      await bffPatch(`/appointment/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      toast.info("Appointment has been cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Error banner */}
        {error && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("session")
              ? "Your session has expired. Please sign out and sign in again."
              : `Notice: ${error}`}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block">Total Requests</span>
            <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">{totalCount}</span>
            <span className="text-[11px] text-neutral-400">All-time appointments</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block">Pending</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingCount}</span>
            <span className="text-[11px] text-neutral-400">Awaiting confirmation</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block">Confirmed</span>
            <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">{confirmedCount}</span>
            <span className="text-[11px] text-neutral-400">Ready for treatment</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block">Cancelled</span>
            <span className="text-2xl font-extrabold text-neutral-400 mt-1 block">{cancelledCount}</span>
            <span className="text-[11px] text-neutral-400">Declined or aborted</span>
          </div>
        </div>

        {/* Next Upcoming Appointment */}
        {nextUpcoming && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-900" />
                <h3 className="text-base font-bold text-neutral-900">Next Scheduled Appointment</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  nextUpcoming.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {nextUpcoming.status}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <img
                  src={nextUpcoming.serviceImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"}
                  alt={nextUpcoming.serviceName}
                  className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">
                    {nextUpcoming.serviceCategory}
                  </span>
                  <h4 className="text-lg font-bold text-neutral-900">{nextUpcoming.serviceName}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-neutral-900">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {formatDate(nextUpcoming.date)} at {nextUpcoming.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {formatDuration(nextUpcoming.serviceDuration)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {nextUpcoming.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                {nextUpcoming.paymentStatus === "unpaid" && nextUpcoming.status === "confirmed" && (
                  <Link
                    href={`/checkout/${nextUpcoming._id}`}
                    className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay {formatPrice(nextUpcoming.servicePrice)}</span>
                  </Link>
                )}
                {nextUpcoming.paymentStatus === "unpaid" && nextUpcoming.status === "pending" && (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                    Awaiting Confirmation
                  </span>
                )}
                {nextUpcoming.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(nextUpcoming._id)}
                    className="px-3.5 py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Appointments Table */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Recent Appointments</h3>
              <p className="text-xs text-neutral-500">Detailed history of your beauty bookings</p>
            </div>
            <Link
              href="/dashboard/appointments"
              className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm text-neutral-500">No appointments yet.</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                Book a Service
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Service</th>
                      <th className="py-3.5 px-6">Date & Time</th>
                      <th className="py-3.5 px-6">Price</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Payment</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {appointments.slice(0, 5).map((apt) => (
                      <tr key={apt._id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={apt.serviceImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"}
                              alt={apt.serviceName}
                              className="w-10 h-10 rounded-xl object-cover border border-neutral-200"
                            />
                            <div>
                              <p className="font-bold text-neutral-900 text-sm">{apt.serviceName}</p>
                              <p className="text-neutral-500 text-[11px]">{apt.specialist}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-neutral-700 font-medium">
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
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                              apt.paymentStatus === "paid"
                                ? "text-emerald-700 bg-emerald-50"
                                : "text-amber-700 bg-amber-50"
                            }`}
                          >
                            {apt.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {apt.paymentStatus === "unpaid" && apt.status === "confirmed" ? (
                            <Link
                              href={`/checkout/${apt._id}`}
                              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-black"
                            >
                              Pay Now
                            </Link>
                          ) : (
                            <span className="text-neutral-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-neutral-100">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {apt.status}
                      </span>
                      <span className="font-bold text-neutral-900 text-sm">
                        {formatPrice(apt.servicePrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.serviceImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80"}
                        alt={apt.serviceName}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{apt.serviceName}</h4>
                        <p className="text-xs text-neutral-500">
                          {formatDate(apt.date)} at {apt.time}
                        </p>
                      </div>
                    </div>
                    {apt.paymentStatus === "unpaid" && apt.status === "confirmed" && (
                      <Link
                        href={`/checkout/${apt._id}`}
                        className="w-full py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay {formatPrice(apt.servicePrice)}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
