"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/upload-image";
import { toast } from "sonner";
import { ShieldCheck, User, Mail, Phone, Upload, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProfilePage() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
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
            toast.success("Administrator photo uploaded!");
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
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setIsSaving(true);
        try {
            await updateProfile({ name, phone, avatar });
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
        <AdminLayout>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs max-w-2xl space-y-6">
                <div className="pb-5 border-b border-neutral-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Master Administrator Access</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                        Administrator Profile & Security
                    </h1>
                    <p className="text-xs text-neutral-500">
                        Manage your administrative credentials and security
                        preferences
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <Image
                            src={
                                avatar ||
                                user?.avatar ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                            }
                            alt={name}
                            width={80}
                            height={80}
                            unoptimized
                            className="w-20 h-20 rounded-full object-cover border-2 border-neutral-900 shadow-xs shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                Admin Photo (Upload or URL)
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="url"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    placeholder="https://..."
                                    className="h-10 flex-1 px-3 text-xs"
                                />
                                <Input
                                    id="admin-profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="sr-only"
                                />
                                <Button
                                    nativeButton={false}
                                    variant="outline"
                                    type="button"
                                    disabled={isUploading}
                                    render={
                                        <label htmlFor="admin-profile-image" />
                                    }
                                    className="h-10 shrink-0 gap-1.5"
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

                    <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                            Admin Name
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
                                className="h-10 pl-10 pr-4 text-sm font-semibold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                            Email Address (Protected System Role)
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                type="email"
                                value={email}
                                disabled
                                className="h-10 pl-10 pr-4 text-sm font-semibold"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-neutral-900 block">
                                System Access Role
                            </span>
                            <span className="text-[11px] text-neutral-500">
                                Unrestricted Console Permissions
                            </span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider">
                            Master Admin
                        </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="h-11 rounded-full px-6 text-xs font-bold shadow-xs"
                        >
                            <Check className="w-4 h-4" />
                            <span>
                                {isSaving ? "Saving..." : "Save Admin Profile"}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
