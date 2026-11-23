"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { bffGet, bffPatch } from "@/lib/server-api";
import { toast } from "sonner";
import {
    Users,
    Search,
    AlertCircle,
    Loader2,
    ShieldAlert,
    ShieldCheck,
    Eye,
    Mail,
    Phone,
    Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    const [blockTarget, setBlockTarget] = useState<CustomerUser | null>(null);

    const loadUsers = useCallback(() => {
        bffGet<{ users: CustomerUser[] }>("/users")
            .then((data) => {
                // Show exactly what the server returns — never fabricate
                // user records (a fallback would hardcode isBlocked: false
                // and misreport block status).
                setCustomers(data.users ?? []);
                if (!data.users || data.users.length === 0) {
                    setError(null);
                }
            })
            .catch((err) => {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load registered customers.",
                );
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleToggleBlock = async (user: CustomerUser) => {
        setUpdatingId(user.email);
        const newBlockedState = !user.isBlocked;
        try {
            await bffPatch(
                `/user/${encodeURIComponent(user.email)}/toggle-block`,
                {
                    isBlocked: newBlockedState,
                },
            );
            setCustomers((prev) =>
                prev.map((c) =>
                    c.email === user.email
                        ? { ...c, isBlocked: newBlockedState }
                        : c,
                ),
            );
            if (selectedUser?.email === user.email) {
                setSelectedUser((prev) =>
                    prev ? { ...prev, isBlocked: newBlockedState } : null,
                );
            }
            toast.success(
                newBlockedState
                    ? `User ${user.name} has been BLOCKED.`
                    : `User ${user.name} has been UNBLOCKED.`,
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update user access.",
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()),
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
                            View customer profiles, track booking history, and
                            manage platform access permissions
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
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="h-10 w-full rounded-xl bg-neutral-50/50 pl-9 pr-4 text-xs font-medium focus-visible:bg-white sm:text-sm"
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
                            <table className="w-full min-w-190 text-left text-xs">
                                <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-6">
                                            Customer
                                        </th>
                                        <th className="py-3.5 px-6">Contact</th>
                                        <th className="py-3.5 px-6">
                                            Total Bookings
                                        </th>
                                        <th className="py-3.5 px-6">
                                            Access Status
                                        </th>
                                        <th className="py-3.5 px-6 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filtered.map((customer) => (
                                        <tr
                                            key={customer.email}
                                            className="hover:bg-neutral-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {customer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
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
                                                <p>
                                                    {customer.phone ||
                                                        "No phone added"}
                                                </p>
                                                <span className="text-[10px] text-neutral-400">
                                                    Last:{" "}
                                                    {new Date(
                                                        customer.lastBooking,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-neutral-900 text-sm">
                                                    {customer.bookingCount}
                                                </span>
                                                <span className="text-neutral-400 ml-1">
                                                    booking
                                                    {customer.bookingCount !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {customer.isBlocked ? (
                                                    <Badge
                                                        variant="destructive"
                                                        className="h-6 gap-1 rounded-full px-2.5 text-[11px] font-bold"
                                                    >
                                                        <ShieldAlert className="w-3 h-3" />
                                                        Blocked
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-6 gap-1 rounded-full bg-emerald-100 px-2.5 text-[11px] font-bold text-emerald-800"
                                                    >
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Active
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                customer,
                                                            )
                                                        }
                                                        aria-label={`View ${customer.name}`}
                                                        className="size-8 rounded-lg text-neutral-600 hover:text-neutral-900"
                                                        title="View User Details"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            customer.isBlocked
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        size="sm"
                                                        type="button"
                                                        onClick={() =>
                                                            setBlockTarget(
                                                                customer,
                                                            )
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            customer.email
                                                        }
                                                        className={`h-8 rounded-lg px-3 text-xs font-bold ${customer.isBlocked ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}
                                                    >
                                                        {customer.isBlocked
                                                            ? "Unblock User"
                                                            : "Block User"}
                                                    </Button>
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
                                        No customers found matching &ldquo;
                                        {searchQuery}&rdquo;.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User Details Modal */}
                <Dialog
                    open={selectedUser !== null}
                    onOpenChange={(open) => {
                        if (!open) setSelectedUser(null);
                    }}
                >
                    {selectedUser && (
                        <DialogContent className="max-w-md rounded-3xl p-6 sm:max-w-md">
                            <DialogHeader className="border-b border-neutral-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-neutral-900" />
                                    <DialogTitle className="text-base font-bold text-neutral-900">
                                        Customer Details
                                    </DialogTitle>
                                </div>
                                <DialogDescription className="sr-only">
                                    Account details and platform access status
                                    for {selectedUser.name}.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-2xl">
                                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white text-base font-bold">
                                        {selectedUser.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-neutral-900">
                                            {selectedUser.name}
                                        </h4>
                                        <p className="text-neutral-500">
                                            {selectedUser.role.toUpperCase()}{" "}
                                            Account
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 p-3.5 rounded-2xl border border-neutral-200">
                                    <div className="flex items-center gap-2 text-neutral-700">
                                        <Mail className="w-4 h-4 text-neutral-400" />
                                        <span>{selectedUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-700">
                                        <Phone className="w-4 h-4 text-neutral-400" />
                                        <span>
                                            {selectedUser.phone ||
                                                "No phone registered"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-700">
                                        <Calendar className="w-4 h-4 text-neutral-400" />
                                        <span>
                                            Total Bookings:{" "}
                                            {selectedUser.bookingCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                                    <span className="font-semibold text-neutral-700">
                                        Platform Access Status:
                                    </span>
                                    <Badge
                                        variant={
                                            selectedUser.isBlocked
                                                ? "destructive"
                                                : "secondary"
                                        }
                                        className={`h-6 rounded-full px-2.5 text-xs font-bold uppercase ${selectedUser.isBlocked ? "" : "bg-emerald-100 text-emerald-800"}`}
                                    >
                                        {selectedUser.isBlocked
                                            ? "Blocked"
                                            : "Active"}
                                    </Badge>
                                </div>
                            </div>

                            <DialogFooter className="flex-row justify-between border-t border-neutral-100 bg-transparent pt-3">
                                <Button
                                    variant={
                                        selectedUser.isBlocked
                                            ? "default"
                                            : "destructive"
                                    }
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                        setBlockTarget(selectedUser);
                                    }}
                                    disabled={updatingId === selectedUser.email}
                                    className={`h-9 rounded-xl px-4 text-xs font-bold ${selectedUser.isBlocked ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}
                                >
                                    {selectedUser.isBlocked
                                        ? "Unblock Customer"
                                        : "Block Customer"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="h-9 rounded-xl px-4 text-xs font-semibold"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>

                {/* Block / Unblock Confirmation Dialog */}
                <Dialog
                    open={!!blockTarget}
                    onOpenChange={(open) => {
                        if (!open) setBlockTarget(null);
                    }}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {blockTarget?.isBlocked
                                    ? "Unblock this customer?"
                                    : "Block this customer?"}
                            </DialogTitle>
                            <DialogDescription>
                                {blockTarget?.isBlocked ? (
                                    <>
                                        <strong>{blockTarget?.name}</strong>{" "}
                                        will be able to sign in and use all
                                        platform features again.
                                    </>
                                ) : (
                                    <>
                                        <strong>{blockTarget?.name}</strong>{" "}
                                        will no longer be able to access
                                        protected platform features until
                                        unblocked.
                                    </>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setBlockTarget(null)}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                disabled={
                                    blockTarget !== null &&
                                    updatingId === blockTarget.email
                                }
                                onClick={() => {
                                    if (blockTarget) {
                                        handleToggleBlock(blockTarget);
                                        setBlockTarget(null);
                                    }
                                }}
                                className={`rounded-full ${blockTarget?.isBlocked ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"}`}
                            >
                                {blockTarget?.isBlocked
                                    ? "Yes, Unblock"
                                    : "Yes, Block"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
