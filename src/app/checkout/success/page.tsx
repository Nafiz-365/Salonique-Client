import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CustomerLayout } from "@/components/dashboard/CustomerLayout";

export default function CheckoutSuccessPage() {
  return (
    <CustomerLayout>
      <section className="mx-auto max-w-xl rounded-3xl border border-neutral-200/80 bg-white p-8 text-center shadow-xs">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">
          Checkout complete
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Stripe is confirming your payment. Your appointment will show as paid
          after the signed payment notification is received.
        </p>
        <Link
          href="/dashboard/appointments"
          className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
        >
          View my appointments
        </Link>
      </section>
    </CustomerLayout>
  );
}
