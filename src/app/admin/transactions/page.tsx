"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { bffGet, ApiTransaction } from "@/lib/server-api";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, X, Loader2, AlertCircle, TrendingUp } from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    bffGet<{ transactions: ApiTransaction[] }>("/transactions")
      .then((data) => setTransactions(data.transactions ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Transactions</h1>
            <p className="text-xs text-neutral-500 mt-1">Complete payment history and revenue overview</p>
          </div>
          <div className="bg-white border border-neutral-200 px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xs">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-[11px] text-neutral-400 block">Total Revenue</span>
              <span className="text-base font-extrabold text-neutral-900">{formatPrice(totalRevenue)}</span>
            </div>
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
                    <th className="py-3.5 px-6">Stripe Ref / ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Related Service</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Currency</th>
                    <th className="py-3.5 px-6">Payment Status</th>
                    <th className="py-3.5 px-6">Transaction Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((txn) => (
                    <tr key={txn._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-neutral-500 text-[11px]">
                        {txn._id.startsWith("cs_") ? txn._id.slice(0, 14) + "..." : txn._id.slice(-10)}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-neutral-900">{txn.customerName}</p>
                        <p className="text-neutral-400 text-[11px]">{txn.customerEmail}</p>
                      </td>
                      <td className="py-4 px-6 font-medium text-neutral-800">{txn.serviceName}</td>
                      <td className="py-4 px-6 font-extrabold text-neutral-900">
                        {formatPrice(txn.amount)}
                      </td>
                      <td className="py-4 px-6 text-neutral-600 font-semibold text-xs">USD ($)</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                            txn.status === "succeeded"
                              ? "bg-emerald-100 text-emerald-800"
                              : txn.status === "refunded"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-neutral-600">{formatDate(txn.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-neutral-400">
                  No transactions found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
