"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    bffGet,
    ApiService,
    ApiAppointment,
    ApiTransaction,
} from "@/lib/server-api";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowRight, Plus, Loader2, AlertCircle } from "lucide-react";

export default function AdminOverviewPage() {
    const [services, setServices] = useState<ApiService[]>([]);
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
    const [registeredCustomersCount, setRegisteredCustomersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            bffGet<{ services: ApiService[]; total: number }>(
                "/admin/services",
            ),
            bffGet<{ appointments: ApiAppointment[] }>("/all-appointments"),
            bffGet<{ transactions: ApiTransaction[] }>("/transactions"),
            bffGet<{ users: { id: string }[] }>("/users"),
        ])
            .then(([svcData, aptData, txData, userData]) => {
                setServices(svcData.services ?? []);
                setAppointments(aptData.appointments ?? []);
                setTransactions(txData.transactions ?? []);
                setRegisteredCustomersCount(userData.users?.length ?? 0);
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const totalRevenue = transactions
        .filter((t) => t.status === "paid" || t.status === "succeeded")
        .reduce((acc, t) => acc + t.amount, 0);
    const successfulPaymentsCount = transactions.filter(
        (t) => t.status === "paid" || t.status === "succeeded",
    ).length;
    const activeServicesCount = services.filter((s) => s.isActive).length;
    const pendingAppointmentsCount = appointments.filter(
        (a) => a.status === "pending",
    ).length;
    const confirmedAppointmentsCount = appointments.filter(
        (a) => a.status === "confirmed",
    ).length;
    const cancelledAppointmentsCount = appointments.filter(
        (a) => a.status === "cancelled",
    ).length;
    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1">
                            Full operational overview — manage services,
                            bookings, and revenue
                        </p>
                    </div>
                    <Link
                        href="/admin/services"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Service
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Backend not connected — {error}. Start the Express
                        server.
                    </div>
                )}

                {/* Stats Cards */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* 1. Total Registered Customers */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Registered Customers
                                </span>
                                <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
                                    {registeredCustomersCount}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    Customer accounts
                                </span>
                            </div>

                            {/* 2. Total Active Services */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Active Services
                                </span>
                                <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
                                    {activeServicesCount}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    of {services.length} total services
                                </span>
                            </div>

                            {/* 3. Total Appointment Requests */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Total Requests
                                </span>
                                <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
                                    {appointments.length}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    All-time bookings
                                </span>
                            </div>

                            {/* 4. Pending Appointments */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Pending
                                </span>
                                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                                    {pendingAppointmentsCount}
                                </span>
                                <span className="text-[11px] text-amber-600/80 font-medium">
                                    Needs admin review
                                </span>
                            </div>

                            {/* 5. Confirmed Appointments */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Confirmed
                                </span>
                                <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                                    {confirmedAppointmentsCount}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    Approved sessions
                                </span>
                            </div>

                            {/* 6. Cancelled Appointments */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Cancelled
                                </span>
                                <span className="text-2xl font-extrabold text-neutral-400 mt-1 block">
                                    {cancelledAppointmentsCount}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    Declined requests
                                </span>
                            </div>

                            {/* 7. Total Successful Payments */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Successful Payments
                                </span>
                                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                                    {successfulPaymentsCount}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    Stripe transactions
                                </span>
                            </div>

                            {/* 8. Total Revenue */}
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                                <span className="text-xs font-semibold text-neutral-500 block">
                                    Total Revenue
                                </span>
                                <span className="text-2xl font-extrabold text-neutral-900 mt-1 block">
                                    {formatPrice(totalRevenue)}
                                </span>
                                <span className="text-[11px] text-emerald-600 font-medium">
                                    Confirmed income
                                </span>
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900">
                                        Recent Appointments
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Latest bookings across all customers
                                    </p>
                                </div>
                                <Link
                                    href="/admin/appointments"
                                    className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-190 text-left text-xs">
                                    <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-6">
                                                Customer
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Service
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Date
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Price
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Status
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Payment
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {appointments.slice(0, 6).map((apt) => (
                                            <tr
                                                key={apt._id}
                                                className="hover:bg-neutral-50/50 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-neutral-900">
                                                        {apt.userName}
                                                    </p>
                                                    <p className="text-neutral-400 text-[11px]">
                                                        {apt.userEmail}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-neutral-800">
                                                    {apt.serviceName}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {formatDate(apt.date)}
                                                    <span className="block text-neutral-400 text-[11px]">
                                                        {apt.time}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-bold text-neutral-900">
                                                    {formatPrice(
                                                        apt.servicePrice,
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                                                            apt.status ===
                                                            "confirmed"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : apt.status ===
                                                                    "pending"
                                                                  ? "bg-amber-100 text-amber-800"
                                                                  : apt.status ===
                                                                      "completed"
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {appointments.length === 0 && (
                                    <div className="py-12 text-center text-sm text-neutral-400">
                                        No appointments yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900">
                                        Recent Transactions
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Latest payment activity
                                    </p>
                                </div>
                                <Link
                                    href="/admin/transactions"
                                    className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-190 text-left text-xs">
                                    <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-6">
                                                Customer
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Service
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Amount
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Method
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Status
                                            </th>
                                            <th className="py-3.5 px-6">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {transactions.slice(0, 5).map((txn) => (
                                            <tr
                                                key={txn._id}
                                                className="hover:bg-neutral-50/50 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-neutral-900">
                                                        {txn.customerName}
                                                    </p>
                                                    <p className="text-neutral-400 text-[11px]">
                                                        {txn.customerEmail}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-neutral-800">
                                                    {txn.serviceName}
                                                </td>
                                                <td className="py-4 px-6 font-extrabold text-neutral-900">
                                                    {formatPrice(txn.amount)}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {txn.paymentMethod}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                                                            txn.status ===
                                                                "paid" ||
                                                            txn.status ===
                                                                "succeeded"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : txn.status ===
                                                                    "refunded"
                                                                  ? "bg-blue-100 text-blue-800"
                                                                  : "bg-amber-100 text-amber-800"
                                                        }`}
                                                    >
                                                        {txn.status ===
                                                            "paid" ||
                                                        txn.status ===
                                                            "succeeded"
                                                            ? "Paid"
                                                            : txn.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {formatDate(txn.date)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {transactions.length === 0 && (
                                    <div className="py-12 text-center text-sm text-neutral-400">
                                        No transactions yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
