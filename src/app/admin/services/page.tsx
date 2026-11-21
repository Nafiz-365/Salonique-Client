"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { bffGet, bffPost, bffPatch, bffDelete, ApiService } from "@/lib/server-api";
import { CategoryType } from "@/lib/types";
import { formatPrice, formatDuration } from "@/lib/utils";
import { uploadToImgBB } from "@/lib/upload-image";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Scissors,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import Image from "next/image";

const CATEGORIES: CategoryType[] = [
  "Hair", "Nails", "Facial", "Massage",
  "Makeup", "Brows & Lashes", "Waxing", "Spa",
];

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
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ApiService | null>(null);
  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("Duration must be a positive number greater than 0 minutes");
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
      shortDescription: formData.shortDescription || formData.name.slice(0, 100),
      description: formData.description || formData.name,
      image: formData.image,
      gallery: [formData.image],
      location: formData.location,
      featured: formData.featured,
      isActive: formData.isActive,
      specialist: {
        name: formData.specialistName,
        role: formData.specialistRole,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.specialistName,
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
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Delete "${name}"? Cancel pending or confirmed unpaid appointments first.`
      )
    ) return;
    setIsDeleting(id);
    try {
      await bffDelete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete service");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleActive = async (service: ApiService) => {
    try {
      await bffPatch(`/services/${service._id}`, { isActive: !service.isActive });
      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, isActive: !s.isActive } : s
        )
      );
      toast.success(service.isActive ? "Service hidden from listing" : "Service is now active");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Services</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Manage your service catalog — add, edit, and control availability
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Service
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error} — start the Express server to manage services.
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {cat}
              </button>
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
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Service</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Duration</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((service) => (
                    <tr key={service._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={service.image}
                            alt={service.name}
                            width={48}
                            height={40}
                            unoptimized
                            className="w-12 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 text-sm">{service.name}</p>
                            <p className="text-neutral-400 text-[11px] line-clamp-1">
                              {service.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-neutral-900">
                        {formatPrice(service.price)}
                      </td>
                      <td className="py-4 px-6 text-neutral-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(service.duration)}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => toggleActive(service)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            service.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                          }`}
                        >
                          {service.isActive ? (
                            <><Eye className="w-3 h-3" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Hidden</>
                          )}
                        </button>
                        {service.featured && (
                          <span className="ml-1.5 text-[10px] font-bold text-rose-500">★ Featured</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(service)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {isDeleting === service._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(service._id, service.name)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
                  <p className="text-sm text-neutral-500">No services found.</p>
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add First Service
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl my-4">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Luxury Balayage"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Category + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g. SoHo, New York"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    min={1}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    required
                    min={15}
                    step={15}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Specialist */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Specialist Name</label>
                  <input
                    type="text"
                    value={formData.specialistName}
                    onChange={(e) => setFormData({ ...formData, specialistName: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Specialist Title</label>
                  <input
                    type="text"
                    value={formData.specialistRole}
                    onChange={(e) => setFormData({ ...formData, specialistRole: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
                    <label className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow-xs transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? "Uploading..." : "Upload Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
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
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                      shortDescription: e.target.value.slice(0, 120),
                    })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-neutral-900"
                  />
                  Featured on Homepage
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-neutral-900"
                  />
                  Active & Bookable
                </label>
              </div>

              {/* Footer buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                  ) : (
                    editingService ? "Save Changes" : "Create Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
