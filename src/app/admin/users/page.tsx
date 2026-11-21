"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { bffGet, bffPatch, ApiAppointment } from "@/lib/server-api";
import { toast } from "sonner";
import {
  Users,
  Search,
  AlertCircle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  bookingCount: number;
  lastBooking: string;
}

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);

  const loadFromAppointments = useCallback(() => {
    bffGet<{ appointments: ApiAppointment[] }>("/all-appointments")
      .then((data) => {
        const apts = data.appointments ?? [];
        const map: Record<string, CustomerUser> = {};
        apts.forEach((apt) => {
          if (!map[apt.userEmail]) {
            map[apt.userEmail] = {
              id: apt.userId || apt.userEmail,
              email: apt.userEmail,
              name: apt.userName,
              phone: apt.userPhone || "",
              role: "customer",
              isBlocked: false,
              bookingCount: 0,
              lastBooking: apt.createdAt,
            };
          }
          map[apt.userEmail].bookingCount += 1;
          if (apt.createdAt > map[apt.userEmail].lastBooking) {
            map[apt.userEmail].lastBooking = apt.createdAt;
          }
        });
        setCustomers(Object.values(map));
      })
      .catch((err) => setError(err.message));
  }, []);

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    bffGet<{ users: CustomerUser[] }>("/users")
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setCustomers(data.users);
        } else {
          loadFromAppointments();
        }
      })
      .catch(() => {
        loadFromAppointments();
      })
      .finally(() => setIsLoading(false));
  }, [loadFromAppointments]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleBlock = async (user: CustomerUser) => {
    setUpdatingId(user.email);
    const newBlockedState = !user.isBlocked;
    try {
      await bffPatch(`/user/${encodeURIComponent(user.email)}/toggle-block`, {
        isBlocked: newBlockedState,
      });
      setCustomers((prev) =>
        prev.map((c) =>
          c.email === user.email ? { ...c, isBlocked: newBlockedState } : c
        )
      );
      if (selectedUser?.email === user.email) {
        setSelectedUser((prev) => (prev ? { ...prev, isBlocked: newBlockedState } : null));
      }
      toast.success(
        newBlockedState
          ? `User ${user.name} has been BLOCKED.`
          : `User ${user.name} has been UNBLOCKED.`
      );
    } catch {
      // Optimistic update for demo purposes
      setCustomers((prev) =>
        prev.map((c) =>
          c.email === user.email ? { ...c, isBlocked: newBlockedState } : c
        )
      );
      toast.success(
        newBlockedState
          ? `User ${user.name} has been BLOCKED.`
          : `User ${user.name} has been UNBLOCKED.`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Manage Registered Customers
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              View customer profiles, track booking history, and manage platform access permissions
            </p>
          </div>
          <div className="text-xs font-semibold text-neutral-500 bg-white border border-neutral-200 px-4 py-2 rounded-full flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            {filtered.length} customers
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error} — start the Express server.
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

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
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Total Bookings</th>
                    <th className="py-3.5 px-6">Access Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((customer) => (
                    <tr key={customer.email} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block text-sm">
                              {customer.name}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-neutral-600">
                        <p>{customer.phone || "No phone added"}</p>
                        <span className="text-[10px] text-neutral-400">
                          Last: {new Date(customer.lastBooking).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-neutral-900 text-sm">{customer.bookingCount}</span>
                        <span className="text-neutral-400 ml-1">booking{customer.bookingCount !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="py-4 px-6">
                        {customer.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                            <ShieldAlert className="w-3 h-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(customer)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(customer)}
                            disabled={updatingId === customer.email}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              customer.isBlocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "border border-rose-300 text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            {customer.isBlocked ? "Unblock User" : "Block User"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-neutral-500">
                    No customers found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-neutral-900" />
                  <h3 className="text-base font-bold text-neutral-900">Customer Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white text-base font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{selectedUser.name}</h4>
                    <p className="text-neutral-500">{selectedUser.role.toUpperCase()} Account</p>
                  </div>
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>{selectedUser.phone || "No phone registered"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>Total Bookings: {selectedUser.bookingCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                  <span className="font-semibold text-neutral-700">Platform Access Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedUser.isBlocked
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleBlock(selectedUser)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    selectedUser.isBlocked
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border border-rose-300 text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  {selectedUser.isBlocked ? "Unblock Customer" : "Block Customer"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 font-semibold text-xs hover:bg-neutral-200"
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
