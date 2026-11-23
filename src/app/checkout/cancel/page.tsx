import Link from "next/link";
import { CircleX } from "lucide-react";
import { CustomerLayout } from "@/components/dashboard/CustomerLayout";

export default function CheckoutCancelPage() {
    return (
        <CustomerLayout>
            <section className="mx-auto max-w-xl rounded-3xl border border-neutral-200/80 bg-white p-8 text-center shadow-xs">
                <CircleX className="mx-auto h-12 w-12 text-amber-600" />
                <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">
                    Checkout canceled
                </h1>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Your payment was not completed. The appointment remains
                    unpaid, and you can try again from your appointments.
                </p>
                <Link
                    href="/dashboard/appointments"
                    className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
                >
                    Return to appointments
                </Link>
            </section>
        </CustomerLayout>
    );
}
