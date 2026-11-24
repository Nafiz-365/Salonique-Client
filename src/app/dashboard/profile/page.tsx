"use client";

import React, { useState } from "react";
import { CustomerLayout } from "@/components/dashboard/CustomerLayout";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/upload-image";
import { toast } from "sonner";
import { User, Mail, Phone, Upload, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <CustomerLayout>
            {user ? <ProfileEditor key={user.id} user={user} /> : null}
        </CustomerLayout>
    );
}

function ProfileEditor({ user }: { user: AuthUser }) {
    const { updateProfile } = useAuth();

    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone || "");
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
            const url = await uploadToImgBB(file);
            setAvatar(url);
            toast.success("Profile photo uploaded!");
        } catch {
            toast.error(
                "Failed to upload image. You can paste an image URL instead.",
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setIsSaving(true);
        try {
            // Rule: Users must not be able to change role or blocked status through profile updates
            await updateProfile({
                name,
                phone,
                avatar,
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl rounded-xl border border-[#E8E2D8] bg-white p-4 shadow-xs sm:p-6">
            <div className="pb-6 border-b border-neutral-100 mb-6">
                <h2 className="text-xl font-extrabold text-neutral-900">
                    Profile & Settings
                </h2>
                <p className="text-xs text-neutral-500">
                    Update your contact information and booking profile
                    preferences
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Preview & Upload */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <Image
                        src={
                            avatar ||
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                        }
                        alt={name}
                        width={80}
                        height={80}
                        unoptimized
                        loading="eager"
                        className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            Profile Photo (Upload or URL)
                        </label>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                            <Input
                                type="url"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="https://..."
                                className="h-10 w-full min-w-0 flex-1 px-3 text-xs"
                            />
                            <Input
                                id="customer-profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="sr-only m-0! h-px! w-px! border-0! p-0!"
                            />
                            <Button
                                nativeButton={false}
                                variant="outline"
                                type="button"
                                disabled={isUploading}
                                render={
                                    <label htmlFor="customer-profile-image" />
                                }
                                className="h-10 w-full shrink-0 gap-1.5 self-stretch sm:w-auto sm:self-auto"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload Photo"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-10 pl-10 pr-4 text-sm font-semibold"
                        />
                    </div>
                </div>

                {/* Email (Read-Only) */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                            Email Address
                        </label>
                        <span className="text-[11px] text-neutral-400">
                            Account identifier (locked)
                        </span>
                    </div>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="email"
                            value={user.email}
                            disabled
                            className="h-10 pl-10 pr-4 text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="h-10 pl-10 pr-4 text-sm font-semibold"
                        />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                        Used by your stylist to send appointment SMS reminders
                        and updates.
                    </p>
                </div>

                {/* Account Role Badge (Non-Editable) */}
                <div className="flex items-center justify-between rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] p-3.5">
                    <div>
                        <span className="text-xs font-bold text-neutral-800 block">
                            Account Permission Level
                        </span>
                        <span className="text-[11px] text-neutral-500">
                            Verified Client Member
                        </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-neutral-900 text-white">
                        Customer
                    </span>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="h-11 w-full rounded-full px-6 text-xs font-bold shadow-xs sm:w-auto sm:ml-auto"
                    >
                        <Check className="w-4 h-4" />
                        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
