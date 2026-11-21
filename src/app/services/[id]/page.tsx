"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDuration, formatDate } from "@/lib/utils";
import { Service } from "@/lib/types";
import { toast } from "sonner";
import {
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { fetchService, bffPost, ApiService } from "@/lib/server-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM",
  "02:30 PM", "03:45 PM", "05:00 PM", "06:15 PM",
];

function toService(s: ApiService): Service {
  return {
    id: s._id,
    name: s.name,
    slug: s.slug,
    category: s.category as Service["category"],
    price: s.price,
    duration: s.duration,
    rating: s.rating,
    reviewCount: s.reviewCount,
    description: s.description,
    shortDescription: s.shortDescription,
    image: s.image,
    gallery: s.gallery,
    isActive: s.isActive,
    featured: s.featured,
    popular: s.popular,
    specialist: s.specialist,
    location: s.location,
    included: s.included,
  };
}

interface BookingResult {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  specialist: string;
  servicePrice: number;
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loadedServiceId, setLoadedServiceId] = useState<string | null>(null);
  const isLoadingService = loadedServiceId !== id;
  const [activeImage, setActiveImage] = useState("");

  // Booking form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Protected route: Redirect unauthenticated visitors to Sign In
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.info("Please sign in to view service details and book appointments");
      router.push(`/sign-in?callbackUrl=/services/${id}`);
    }
  }, [isLoading, isAuthenticated, router, id]);

  // Load service from API
  useEffect(() => {
    let active = true;
    fetchService(id)
      .then((data) => {
        if (!active) return;
        if (data) {
          const s = toService(data);
          setService(s);
          setActiveImage(s.image);
        } else {
          setService(null);
        }
      })
      .catch(() => {
        if (active) setService(null);
      })
      .finally(() => {
        if (active) setLoadedServiceId(id);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please sign in to book an appointment");
      router.push("/sign-in");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admins cannot submit customer appointment requests. Please switch to customer view.");
      return;
    }

    if (service && !service.isActive) {
      toast.error("This service is currently inactive and cannot be booked.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please choose a date and time for your appointment");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        customerId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "",
        serviceId: service!.id,
        serviceName: service!.name,
        serviceCategory: service!.category,
        servicePrice: service!.price,
        serviceDuration: service!.duration,
        serviceImage: service!.image,
        date: selectedDate,
        appointmentDate: selectedDate,
        time: selectedTime,
        timeSlot: selectedTime,
        specialist: service!.specialist.name,
        location: service!.location,
        notes,
        message: notes,
      };

      const result = await bffPost<{ appointment: BookingResult }>("/booking", payload);
      toast.success("Appointment requested successfully!");
      setBookingResult(result.appointment);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to book appointment";
      // Handle double-booking error from server
      if (msg.includes("already booked") || msg.includes("slot")) {
        toast.error("That time slot is already taken — please choose another time.");
      } else if (msg.includes("Unauthorized")) {
        toast.error("Please sign in to book an appointment");
        router.push("/sign-in");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingService) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto" />
            <p className="text-sm text-neutral-500">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm mx-auto px-4">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-neutral-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Service not found</h2>
            <p className="text-sm text-neutral-500">
              This service may have been removed or the link is invalid.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              Browse All Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-100 bg-neutral-50/50 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link href="/services" className="hover:text-neutral-900">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-900 truncate">{service.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Gallery & Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="aspect-16/10 rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md bg-neutral-100">
                  <Image
                    src={activeImage}
                    alt={service.name}
                    width={1200}
                    height={750}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.gallery && service.gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {service.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage === img
                            ? "border-neutral-900 ring-2 ring-neutral-900/20"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${service.name} ${idx}`}
                          width={80}
                          height={64}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-neutral-400 font-normal">({service.reviewCount} reviews)</span>
                  </div>
                  <span className="text-xs text-neutral-400">•</span>
                  <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{service.location}</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {service.name}
                </h1>
                <p className="text-neutral-600 text-base leading-relaxed">{service.description}</p>
              </div>

              {/* Specialist */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={service.specialist.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=specialist"}
                    alt={service.specialist.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="w-14 h-14 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Your Specialist</span>
                    <h3 className="text-base font-bold text-neutral-900">{service.specialist.name}</h3>
                    <p className="text-xs text-neutral-500">{service.specialist.role}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{service.specialist.rating}</span>
                </div>
              </div>

              {/* Included */}
              {service.included && service.included.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-bold text-neutral-900">What&apos;s included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.included.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-sm text-neutral-700 bg-white p-3 rounded-xl border border-neutral-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking Box */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                {bookingResult ? (
                  /* Success State */
                  <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold text-neutral-900">Appointment Requested!</h2>
                      <p className="text-xs sm:text-sm text-neutral-500">
                        Your booking request has been submitted with <span className="font-bold text-amber-600">Pending</span> status. Once confirmed by salon staff, you can pay online securely.
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Service:</span>
                        <span className="font-bold text-neutral-900">{bookingResult.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Date & Time:</span>
                        <span className="font-bold text-neutral-900">
                          {formatDate(bookingResult.date)} at {bookingResult.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Specialist:</span>
                        <span className="font-bold text-neutral-900">{bookingResult.specialist}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm">
                        <span className="font-bold text-neutral-900">Total:</span>
                        <span className="font-extrabold text-neutral-900">
                          {formatPrice(bookingResult.servicePrice)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Link
                        href="/dashboard/appointments"
                        className="w-full py-3.5 px-4 rounded-full bg-neutral-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>View My Appointments</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Booking Form */
                  <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xl shadow-neutral-200/40 space-y-6">
                    <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                      <div>
                        <span className="text-xs text-neutral-500 block">Total Investment</span>
                        <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    </div>

                    {!isAuthenticated && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          <Link href="/sign-in" className="font-bold underline">Sign in</Link> to request an appointment.
                        </span>
                      </div>
                    )}

                    <form onSubmit={handleBooking} className="space-y-5">
                      {/* Date */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                          1. Select Appointment Date
                        </label>
                        <Input
                          id="appointment-date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className="h-11 w-full rounded-xl bg-neutral-50/50 px-4 text-sm font-semibold"
                        />
                      </div>

                      {/* Time Slots */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                          2. Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.map((time) => (
                            <Button
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className="h-9 w-full rounded-xl px-1 text-center text-xs font-semibold"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                          3. Special Requests (Optional)
                        </label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Allergies, color preference, specific concerns..."
                          rows={2}
                          className="min-h-20 rounded-xl p-3 text-xs font-medium placeholder:text-neutral-400 sm:text-sm"
                        />
                      </div>

                      {/* Summary */}
                      <div className="p-4 rounded-2xl bg-neutral-50 space-y-2 text-xs">
                        <div className="flex justify-between text-neutral-600">
                          <span>Specialist:</span>
                          <span className="font-semibold text-neutral-900">{service.specialist.name}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Date:</span>
                          <span className="font-semibold text-neutral-900">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Time:</span>
                          <span className="font-semibold text-neutral-900">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900 text-sm">
                          <span>Total:</span>
                          <span>{formatPrice(service.price)}</span>
                        </div>
                      </div>

                      {user?.role === "admin" && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                          Admins cannot submit customer appointment requests. Switch to Customer mode to book.
                        </div>
                      )}

                      {!service.isActive && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                          This service is currently inactive and cannot be booked.
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || user?.role === "admin" || !service.isActive}
                        className="h-12 w-full rounded-full text-sm font-bold shadow-lg shadow-neutral-900/10 hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Booking appointment...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Appointment</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-[11px] text-center text-neutral-400">
                        Free cancellation up to 24 hours prior. Zero upfront booking fee.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
