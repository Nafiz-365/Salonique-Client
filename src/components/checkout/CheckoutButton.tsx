"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type CheckoutResponse = {
  url?: unknown;
  error?: unknown;
};

export function CheckoutButton({
  appointmentId,
  children,
  className,
}: {
  appointmentId: string;
  children: ReactNode;
  className: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = (await response.json().catch(() => null)) as CheckoutResponse | null;

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Could not start checkout.",
        );
      }
      if (typeof data?.url !== "string") {
        throw new Error("Checkout did not return a secure payment URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Opening secure checkout...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
