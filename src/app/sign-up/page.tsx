"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/upload-image";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    ArrowRight,
    Upload,
    Image as ImageIcon,
    Check,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SaloniqueMark } from "@/components/common/SaloniqueMark";
import { getSafeCallbackPath } from "@/lib/safe-redirect";

export default function SignUpPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-sm font-light text-neutral-500">
                    Loading atelier registration...
                </div>
            }
        >
            <SignUpContent />
        </Suspense>
    );
}

function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = getSafeCallbackPath(searchParams.get("callbackUrl"));

    const { register, login, loginWithGoogle, isAuthenticated, user } =
        useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // If already signed in (e.g. after Google OAuth returns here), redirect
    // according to the user's role instead of showing the form again.
    useEffect(() => {
        if (isAuthenticated && user && !isLoading) {
            router.replace(
                callbackUrl ??
                    (user.role === "admin" ? "/admin" : "/dashboard"),
            );
        }
    }, [isAuthenticated, user, isLoading, callbackUrl, router]);

    // Validation rules
    const hasMinLen = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }

        setIsUploading(true);
        try {
            const uploadedUrl = await uploadToImgBB(file);
            setImageUrl(uploadedUrl);
            toast.success("Profile photo uploaded!");
        } catch {
            toast.error(
                "Failed to upload photo. You can paste an image URL instead.",
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (!hasMinLen) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (!hasUpper) {
            toast.error(
                "Password must contain at least one uppercase letter (A-Z)",
            );
            return;
        }
        if (!hasLower) {
            toast.error(
                "Password must contain at least one lowercase letter (a-z)",
            );
            return;
        }
        if (!agreeTerms) {
            toast.error("Please agree to the Terms of Service");
            return;
        }

        setIsLoading(true);
        try {
            const ok = await register(
                name,
                email,
                password,
                imageUrl || undefined,
            );
            if (ok) {
                toast.success("Account created successfully!");
                // Auto sign-in and redirect immediately
                const signedIn = await login(email, password);
                if (signedIn) {
                    router.push(callbackUrl ?? "/dashboard");
                } else {
                    router.push(
                        callbackUrl
                            ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
                            : "/sign-in",
                    );
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex">
            {/* Left Column: Atelier Experience Visual (Hidden on mobile) */}
            <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between bg-[#1C1816] text-[#FAF7F2] p-12 overflow-hidden border-r border-[#2D2623]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
                        alt="Salonique Experience"
                        fill
                        priority
                        unoptimized
                        className="object-cover opacity-40 brightness-75 saturate-75"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,22,0.85)_0%,rgba(28,24,22,0.95)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(216,180,133,0.18)_0%,transparent_70%)]" />
                </div>

                <div className="relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 group"
                    >
                        <SaloniqueMark
                            tone="light"
                            className="size-10 shadow-xs transition-transform group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="text-2xl font-serif font-medium tracking-tight text-white leading-none">
                                Salonique
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-[#D8B485] font-semibold pt-0.5">
                                New York Atelier
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-[0.2em] text-[#E8D1B5]">
                        <Sparkles className="size-3 text-[#D8B485]" />
                        <span>Curated Hospitality</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white leading-tight">
                        Join our private community of beauty lovers.
                    </h2>
                    <p className="text-sm text-[#C5BFB8] font-light leading-relaxed">
                        Experience seamless 24/7 online scheduling, personalized
                        styling notes, and VIP appointments at New York&apos;s
                        most distinguished salons.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-[#9E8265] font-light">
                    © 2026 Salonique Atelier. All rights reserved.
                </div>
            </div>

            {/* Right Column: Sign Up Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
                <div className="w-full max-w-md mx-auto space-y-8">
                    {/* Mobile Brand Link */}
                    <div className="lg:hidden">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 mb-6 group"
                        >
                            <SaloniqueMark className="size-9 shadow-xs" />
                            <span className="text-xl font-serif font-medium tracking-tight text-[#1A1715]">
                                Salonique
                            </span>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-serif font-normal text-[#1A1715] tracking-tight">
                            Create an Account
                        </h1>
                        <p className="mt-2 text-sm text-neutral-600 font-light">
                            Already have an atelier account?{" "}
                            <Link
                                href={
                                    callbackUrl
                                        ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
                                        : "/sign-in"
                                }
                                className="font-medium text-[#7A5C3E] hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Google Sign-up */}
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full h-12 rounded-full py-2.5 text-xs font-medium text-neutral-800 border-[#D8CFBF] bg-white hover:bg-[#FAF7F2] shadow-xs flex items-center justify-center gap-2.5"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Sign up with Google</span>
                    </Button>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-[#EBE5DA] w-full" />
                        <span className="bg-[#FDFBF7] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9E8265] absolute">
                            Or with email
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="full-name"
                                className="block text-xs font-semibold text-[#1A1715] uppercase tracking-wider mb-1.5"
                            >
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-[#9E8265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="full-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Clara Oswald"
                                    className="h-11 rounded-xl pl-10 pr-4 text-sm font-medium border-[#EBE5DA] bg-white focus-visible:ring-[#1A1715]"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold text-[#1A1715] uppercase tracking-wider mb-1.5"
                            >
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#9E8265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="name@example.com"
                                    className="h-11 rounded-xl pl-10 pr-4 text-sm font-medium border-[#EBE5DA] bg-white focus-visible:ring-[#1A1715]"
                                />
                            </div>
                        </div>

                        {/* Profile Image (Upload or URL) */}
                        <div>
                            <label className="block text-xs font-semibold text-[#1A1715] uppercase tracking-wider mb-1.5">
                                Profile Image (Optional)
                            </label>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="relative flex-1">
                                        <ImageIcon className="w-4 h-4 text-[#9E8265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <Input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) =>
                                                setImageUrl(e.target.value)
                                            }
                                            placeholder="Paste photo URL..."
                                            className="h-10 rounded-xl pl-10 pr-4 text-xs font-medium border-[#EBE5DA] bg-white"
                                        />
                                    </div>
                                    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[#D8CFBF] bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 transition-colors hover:bg-[#FAF7F2]">
                                        <Upload className="w-3.5 h-3.5 text-[#9E8265]" />
                                        <span>
                                            {isUploading
                                                ? "Uploading..."
                                                : "Upload Photo"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {imageUrl && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <Image
                                            src={imageUrl}
                                            alt="Avatar preview"
                                            width={32}
                                            height={32}
                                            unoptimized
                                            className="w-8 h-8 rounded-full object-cover border border-[#E0D8CB]"
                                        />
                                        <span className="text-[11px] text-emerald-700 font-medium">
                                            Photo preview ready
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-[#1A1715] uppercase tracking-wider mb-1.5"
                            >
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#9E8265] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    placeholder="Create a strong password"
                                    className="h-11 rounded-xl pl-10 pr-12 text-sm font-medium border-[#EBE5DA] bg-white focus-visible:ring-[#1A1715]"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-2 top-1/2 size-8 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            {/* Password Rules Checklist */}
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-neutral-500 font-light">
                                <span
                                    className={`flex items-center gap-1 ${hasMinLen ? "text-emerald-700 font-medium" : ""}`}
                                >
                                    <Check
                                        className={`w-3 h-3 ${hasMinLen ? "text-emerald-700" : "text-neutral-300"}`}
                                    />
                                    Min 6 characters
                                </span>
                                <span
                                    className={`flex items-center gap-1 ${hasUpper ? "text-emerald-700 font-medium" : ""}`}
                                >
                                    <Check
                                        className={`w-3 h-3 ${hasUpper ? "text-emerald-700" : "text-neutral-300"}`}
                                    />
                                    1 uppercase (A-Z)
                                </span>
                                <span
                                    className={`flex items-center gap-1 ${hasLower ? "text-emerald-700 font-medium" : ""}`}
                                >
                                    <Check
                                        className={`w-3 h-3 ${hasLower ? "text-emerald-700" : "text-neutral-300"}`}
                                    />
                                    1 lowercase (a-z)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="terms"
                                checked={agreeTerms}
                                onCheckedChange={(checked) =>
                                    setAgreeTerms(checked === true)
                                }
                            />
                            <label
                                htmlFor="terms"
                                className="text-xs text-neutral-600 font-light"
                            >
                                I agree to the{" "}
                                <Link
                                    href="/terms"
                                    className="underline hover:text-[#1A1715]"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="underline hover:text-[#1A1715]"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="w-full h-12 rounded-full text-sm font-medium bg-[#1A1715] hover:bg-[#2D2623] text-white shadow-xs transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading
                                ? "Creating account..."
                                : "Create Account & Enter Atelier"}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
