"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Unhandled Application Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7] items-center justify-center px-4 py-16">
            <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE5DA] shadow-xs">
                <div className="size-14 rounded-full bg-[#FAF7F2] border border-[#EBE5DA] flex items-center justify-center mx-auto text-[#9E8265]">
                    <AlertCircle className="size-7" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1715]">
                    Something went wrong
                </h2>

                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    An unexpected interruption occurred. Our concierge has been
                    alerted, and you may retry loading the view.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1715] hover:bg-[#2D2623] text-white text-xs font-medium transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                    </Button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D8CFBF] bg-white hover:bg-[#FAF7F2] text-[#1A1715] text-xs font-medium transition-all"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Return to Atelier</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
