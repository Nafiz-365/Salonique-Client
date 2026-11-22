"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/upload-image";
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules
  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("Failed to upload photo. You can paste an image URL instead.");
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
      toast.error("Password must contain at least one uppercase letter (A-Z)");
      return;
    }
    if (!hasLower) {
      toast.error("Password must contain at least one lowercase letter (a-z)");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service");
      return;
    }

    setIsLoading(true);
    try {
      const ok = await register(name, email, password, imageUrl || undefined);
      if (ok) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
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
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-rose-300" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            Salonique
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-neutral-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white px-6 py-8 shadow-xl sm:px-10">

          {/* Google Sign-up */}
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full h-auto rounded-xl py-2.5 text-xs font-bold text-neutral-700 shadow-xs"
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
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 absolute">
              Or email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Clara Oswald"
                  className="h-11 rounded-xl pl-10 pr-4 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="h-11 rounded-xl pl-10 pr-4 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Profile Image (Upload or URL) */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Profile Image (Upload or URL)
              </label>
              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <ImageIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... (or choose a photo)"
                      className="h-10 rounded-xl pl-10 pr-4 text-xs font-medium"
                    />
                  </div>
                  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-100">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
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
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Photo preview ready
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="h-11 rounded-xl pl-10 pr-12 text-sm font-semibold"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 size-8 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {/* Password Rules Checklist */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-neutral-500">
                <span className={`flex items-center gap-1 ${hasMinLen ? "text-emerald-600 font-bold" : ""}`}>
                  <Check className={`w-3 h-3 ${hasMinLen ? "text-emerald-600" : "text-neutral-300"}`} />
                  Min 6 characters
                </span>
                <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-600 font-bold" : ""}`}>
                  <Check className={`w-3 h-3 ${hasUpper ? "text-emerald-600" : "text-neutral-300"}`} />
                  1 uppercase (A-Z)
                </span>
                <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-600 font-bold" : ""}`}>
                  <Check className={`w-3 h-3 ${hasLower ? "text-emerald-600" : "text-neutral-300"}`} />
                  1 lowercase (a-z)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <label htmlFor="terms" className="text-xs text-neutral-500">
                I agree to the{" "}
                <Link href="/terms" className="underline hover:text-neutral-900">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-neutral-900">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full h-auto rounded-full py-3.5 text-sm font-bold shadow-md"
            >
              {isLoading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
