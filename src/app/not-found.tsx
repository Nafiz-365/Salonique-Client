import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE5DA] text-xs font-medium uppercase tracking-[0.2em] text-[#9E8265]">
                        <span>Error 404</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1A1715] tracking-tight">
                        Page Not Found
                    </h1>

                    <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                        The page you are looking for may have been moved,
                        renamed, or is temporarily unavailable in our atelier.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A1715] hover:bg-[#2D2623] text-white text-xs font-medium transition-all shadow-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Return Home</span>
                        </Link>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#D8CFBF] bg-white hover:bg-[#FAF7F2] text-[#1A1715] text-xs font-medium transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#D8B485]" />
                            <span>Explore Services</span>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
