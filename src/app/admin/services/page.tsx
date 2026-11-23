"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    bffGet,
    bffPost,
    bffPatch,
    bffDelete,
    ApiService,
} from "@/lib/server-api";
import { CategoryType, SERVICE_CATEGORIES } from "@/lib/types";
import { formatPrice, formatDuration } from "@/lib/utils";
import { uploadToImgBB } from "@/lib/upload-image";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Scissors,
    Clock,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    Upload,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES: readonly CategoryType[] = SERVICE_CATEGORIES;

const DEFAULT_FORM = {
    name: "",
    category: "Hair" as CategoryType,
    price: 95,
    duration: 60,
    shortDescription: "",
    description: "",
    image: "",
    location: "SoHo, New York",
    specialistName: "Salonique Specialist",
    specialistRole: "Senior Stylist",
    featured: false,
    isActive: true,
};

export default function AdminServicesPage() {
    const [services, setServices] = useState<ApiService[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ApiService | null>(
        null,
    );
    const [formData, setFormData] = useState({ ...DEFAULT_FORM });

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        setIsUploadingImage(true);
        try {
            const url = await uploadToImgBB(file);
            setFormData((prev) => ({ ...prev, image: url }));
            toast.success("Service image uploaded successfully!");
        } catch {
            toast.error("Failed to upload image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const loadServices = () => {
        bffGet<{ services: ApiService[]; total: number }>("/admin/services")
            .then((data) => setServices(data.services ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadServices();
    }, []);

    const filtered = services.filter((s) => {
        const matchesQ =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat =
            selectedCategory === "All" ||
            s.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesQ && matchesCat;
    });

    const openAddModal = () => {
        setEditingService(null);
        setFormData({ ...DEFAULT_FORM });
        setIsModalOpen(true);
    };

    const openEditModal = (service: ApiService) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            category: service.category as CategoryType,
            price: service.price,
            duration: service.duration,
            shortDescription: service.shortDescription,
            description: service.description,
            image: service.image,
            location: service.location,
            specialistName: service.specialist.name,
            specialistRole: service.specialist.role,
            featured: service.featured,
            isActive: service.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Service name is required");
            return;
        }
        if (Number(formData.price) <= 0) {
            toast.error("Price must be a positive number greater than $0");
            return;
        }
        if (Number(formData.duration) <= 0) {
            toast.error(
                "Duration must be a positive number greater than 0 minutes",
            );
            return;
        }
        if (!formData.image.trim()) {
            toast.error("Please upload an image for this service");
            return;
        }

        setIsSaving(true);

        const payload = {
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            duration: Number(formData.duration),
            shortDescription:
                formData.shortDescription || formData.name.slice(0, 100),
            description: formData.description || formData.name,
            image: formData.image,
            gallery: [formData.image],
            location: formData.location,
            featured: formData.featured,
            isActive: formData.isActive,
            specialist: {
                name: formData.specialistName,
                role: formData.specialistRole,
                avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                    formData.specialistName,
                rating: 5.0,
            },
        };

        try {
            if (editingService) {
                await bffPatch(`/services/${editingService._id}`, payload);
                toast.success("Service updated successfully");
            } else {
                await bffPost("/services", payload);
                toast.success("Service created successfully");
            }
            setIsModalOpen(false);
            setIsLoading(true);
            loadServices();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to save service",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        // Confirmation dialog instead of native confirm()
        setDeleteTarget({ id, name });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(deleteTarget.id);
        try {
            await bffDelete(`/services/${deleteTarget.id}`);
            setServices((prev) =>
                prev.filter((s) => s._id !== deleteTarget.id),
            );
            toast.success("Service deleted");
            setDeleteTarget(null);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to delete service",
            );
        } finally {
            setIsDeleting(null);
        }
    };

    const toggleActive = async (service: ApiService) => {
        try {
            await bffPatch(`/services/${service._id}`, {
                isActive: !service.isActive,
            });
            setServices((prev) =>
                prev.map((s) =>
                    s._id === service._id ? { ...s, isActive: !s.isActive } : s,
                ),
            );
            toast.success(
                service.isActive
                    ? "Service hidden from listing"
                    : "Service is now active",
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update service",
            );
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                            Services
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1">
                            Manage your service catalog — add, edit, and control
                            availability
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="h-10 gap-2 rounded-full px-5 text-xs font-bold shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Service
                    </Button>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error} — start the Express server to manage services.
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:gap-4">
                    <div className="relative w-full min-w-0 lg:w-72 lg:shrink-0">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search services..."
                            className="h-10 pl-9 pr-4 text-xs font-medium sm:text-sm"
                        />
                    </div>
                    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:flex-1">
                        {["All", ...CATEGORIES].map((cat) => (
                            <Button
                                variant={
                                    selectedCategory === cat
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`h-8 rounded-full px-3 text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? "bg-neutral-900 text-white"
                                        : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                                }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Services Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-190 text-left text-xs ">
                                <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-6">Service</th>
                                        <th className="py-3.5 px-6">
                                            Category
                                        </th>
                                        <th className="py-3.5 px-6">Price</th>
                                        <th className="py-3.5 px-6">
                                            Duration
                                        </th>
                                        <th className="py-3.5 px-6">Status</th>
                                        <th className="py-3.5 px-6 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filtered.map((service) => (
                                        <tr
                                            key={service._id}
                                            className="hover:bg-neutral-50/50 transition-colors"
                                        >
                                            {/* Service */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={service.image}
                                                        alt={service.name}
                                                        width={48}
                                                        height={40}
                                                        unoptimized
                                                        className="w-12 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-neutral-900 text-sm">
                                                            {service.name}
                                                        </p>
                                                        <p className="text-neutral-400 text-[11px] line-clamp-1">
                                                            {
                                                                service.shortDescription
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-6 align-middle">
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 whitespace-nowrap">
                                                    {service.category}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6 align-middle font-bold text-neutral-900 whitespace-nowrap">
                                                {formatPrice(service.price)}
                                            </td>

                                            {/* Duration */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-1 text-neutral-600 whitespace-nowrap">
                                                    <Clock className="w-3 h-3 shrink-0" />
                                                    {formatDuration(
                                                        service.duration,
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Button
                                                        variant={
                                                            service.isActive
                                                                ? "secondary"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        type="button"
                                                        onClick={() =>
                                                            toggleActive(
                                                                service,
                                                            )
                                                        }
                                                        className={`h-7 gap-1.5 rounded-full px-2.5 text-[11px] font-bold transition-colors ${
                                                            service.isActive
                                                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                                        }`}
                                                    >
                                                        {service.isActive ? (
                                                            <>
                                                                <Eye className="w-3 h-3" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3" />
                                                                Hidden
                                                            </>
                                                        )}
                                                    </Button>

                                                    {service.featured && (
                                                        <span className="text-[10px] font-bold text-rose-500 whitespace-nowrap">
                                                            ★ Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                service,
                                                            )
                                                        }
                                                        aria-label={`Edit ${service.name}`}
                                                        className="size-8 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>

                                                    {isDeleting ===
                                                    service._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    service._id,
                                                                    service.name,
                                                                )
                                                            }
                                                            aria-label={`Delete ${service.name}`}
                                                            className="size-8 rounded-lg border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div className="py-16 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                                        <Scissors className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-neutral-500">
                                        No services found.
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={openAddModal}
                                        className="h-9 gap-2 rounded-full px-5 text-xs font-bold"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add
                                        First Service
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                {isModalOpen && (
                    <DialogContent className="my-4 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl bg-white p-0 shadow-2xl sm:max-w-xl">
                        <DialogHeader className="border-b border-neutral-100 p-6">
                            <DialogTitle className="text-lg font-bold text-neutral-900">
                                {editingService
                                    ? "Edit Service"
                                    : "Add New Service"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSave} className="space-y-4 p-6">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                    Service Name *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                    placeholder="e.g. Luxury Balayage"
                                    className="h-10 text-sm"
                                />
                            </div>

                            {/* Category + Location */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Category
                                    </label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(category) => {
                                            if (category) {
                                                setFormData({
                                                    ...formData,
                                                    category:
                                                        category as CategoryType,
                                                });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Location
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                location: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. SoHo, New York"
                                        className="h-10 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Price + Duration */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: Number(e.target.value),
                                            })
                                        }
                                        required
                                        min={1}
                                        className="h-10 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Duration (min)
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                duration: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        required
                                        min={15}
                                        step={15}
                                        className="h-10 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Specialist */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Specialist Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.specialistName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                specialistName: e.target.value,
                                            })
                                        }
                                        required
                                        className="h-10 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                        Specialist Title
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.specialistRole}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                specialistRole: e.target.value,
                                            })
                                        }
                                        required
                                        className="h-10 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                    Service Image (Image Upload) *
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="admin-service-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploadingImage}
                                            className="sr-only m-0! h-px! w-px! border-0! p-0!"
                                        />
                                        <Button
                                            nativeButton={false}
                                            variant="outline"
                                            type="button"
                                            disabled={isUploadingImage}
                                            render={
                                                <label htmlFor="admin-service-image" />
                                            }
                                            className="h-10 shrink-0 gap-2"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>
                                                {isUploadingImage
                                                    ? "Uploading..."
                                                    : "Upload Image File"}
                                            </span>
                                        </Button>
                                    </div>
                                    {formData.image && (
                                        <div className="flex items-center gap-3 pt-1">
                                            <Image
                                                src={formData.image}
                                                alt="Service preview"
                                                width={56}
                                                height={56}
                                                unoptimized
                                                className="w-14 h-14 rounded-xl object-cover border border-neutral-200"
                                            />
                                            <span className="text-xs text-neutral-500 font-medium truncate">
                                                Preview ready
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                                    Description *
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                            shortDescription:
                                                e.target.value.slice(0, 120),
                                        })
                                    }
                                    required
                                    rows={3}
                                    className="min-h-24 text-sm"
                                />
                            </div>

                            {/* Flags */}
                            <div className="flex items-center gap-4 pt-1">
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                                    <Checkbox
                                        checked={formData.featured}
                                        onCheckedChange={(checked) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                featured: checked === true,
                                            }))
                                        }
                                    />
                                    Featured on Homepage
                                </label>
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                                    <Checkbox
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                isActive: checked === true,
                                            }))
                                        }
                                    />
                                    Active & Bookable
                                </label>
                            </div>

                            {/* Footer buttons */}
                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-9 rounded-full px-5 text-xs font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="h-9 gap-2 rounded-full px-6 text-xs font-bold shadow-md"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                            Saving...
                                        </>
                                    ) : editingService ? (
                                        "Save Changes"
                                    ) : (
                                        "Create Service"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                )}
            </Dialog>

            {/* Delete Confirmation Dialog (no native confirm()) */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete this service?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{deleteTarget?.name}</strong>? Cancel
                            pending or confirmed unpaid appointments first. This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setDeleteTarget(null)}
                            className="rounded-full"
                        >
                            Keep Service
                        </Button>
                        <Button
                            type="button"
                            disabled={isDeleting !== null}
                            onClick={confirmDelete}
                            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                                    Deleting...
                                </>
                            ) : (
                                "Yes, Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
