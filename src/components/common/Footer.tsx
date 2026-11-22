"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, MapPin, Clock, Phone, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Footer() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-neutral-900 font-bold">
                <Sparkles className="w-4.5 h-4.5 text-neutral-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white leading-none">
                  Salonique
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold pt-0.5">
                  SalonBook Platform
                </span>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Your Beauty, Your Time. Discover top-rated salons, independent stylists, and wellness experts near you, with instant 24/7 online booking and secure checkout.
            </p>

            {/* Salon Address, Hours & Contact */}
            <div className="pt-2 space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                <span>142 Mercer Street, SoHo, New York, NY 10012</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM • Sun: 10:00 AM – 6:00 PM</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                <a href="tel:+15557256647" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+1 (555) 725-6647</span>
                </a>
                <a href="mailto:support@salonique.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@salonique.com</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/services?category=Hair" className="hover:text-white transition-colors">
                  Hair Salons & Barbers
                </Link>
              </li>
              <li>
                <Link href="/services?category=Nails" className="hover:text-white transition-colors">
                  Nail Salons & Spas
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial" className="hover:text-white transition-colors">
                  Skin Care & Facials
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage" className="hover:text-white transition-colors">
                  Massage & Bodywork
                </Link>
              </li>
              <li>
                <Link href="/services?featured=true" className="hover:text-white transition-colors">
                  Featured Experiences
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/services?category=Brows %26 Lashes" className="hover:text-white transition-colors">
                  Brows & Lashes
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup" className="hover:text-white transition-colors">
                  Makeup Artistry
                </Link>
              </li>
              <li>
                <Link href="/services?category=Waxing" className="hover:text-white transition-colors">
                  Waxing Treatments
                </Link>
              </li>
              <li>
                <Link href="/services?category=Spa" className="hover:text-white transition-colors">
                  Thermal Spas & Baths
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  All Beauty Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Business */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Salonique
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href={isAdmin ? "/admin" : "/dashboard"} className="hover:text-white transition-colors flex items-center gap-1.5">
                  {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{isAdmin ? "Admin Console" : "Customer Portal"}</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Salonique Inc. All rights reserved. Your Beauty, Your Time.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
            <span>English (US)</span>
            <span>$ USD</span>
            <span>Secure 256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
