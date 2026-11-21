"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  User as UserIcon,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  return <NavbarContent key={pathname} pathname={pathname} />;
}

function NavbarContent({ pathname }: { pathname: string }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Hair", href: "/services?category=Hair" },
    { name: "Nails", href: "/services?category=Nails" },
    { name: "Facial", href: "/services?category=Facial" },
    { name: "Massage", href: "/services?category=Massage" },
    { name: "Makeup", href: "/services?category=Makeup" },
    { name: "Brows & Lashes", href: "/services?category=Brows %26 Lashes" },
    { name: "Waxing", href: "/services?category=Waxing" },
    { name: "Spa", href: "/services?category=Spa" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-neutral-200"
          : "bg-white border-b border-neutral-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white font-semibold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-rose-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                Salonique
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium -mt-1">
                SalonBook Platform
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NextLink
              href="/services"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/services"
                  ? "text-neutral-900 bg-neutral-100 font-semibold"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Explore Services
            </NextLink>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  categoriesDropdownOpen
                    ? "text-neutral-900 bg-neutral-100"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <NextLink
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </NextLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NextLink
              href="/help"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Help & Support
            </NextLink>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 border border-neutral-200 rounded-full hover:shadow-xs transition-all bg-white"
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold text-neutral-900 leading-none">
                      {user.name.split(" ")[0]}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2.5 border-b border-neutral-100 mb-1">
                      <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-800">
                        {user.role === "admin" ? "Master Admin" : "Verified Customer"}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <NextLink
                        href="/dashboard/appointments"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <span>My Appointments</span>
                      </NextLink>

                      <NextLink
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                        <span>Customer Dashboard</span>
                      </NextLink>

                      {user.role === "admin" && (
                        <NextLink
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-900 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold">Admin Console</span>
                        </NextLink>
                      )}

                      <NextLink
                        href="/dashboard/profile"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-neutral-500" />
                        <span>Profile & Settings</span>
                      </NextLink>

                      <div className="border-t border-neutral-100 my-1 pt-1">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NextLink
                  href="/sign-in"
                  className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Log in
                </NextLink>
                <NextLink
                  href="/sign-up"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-900 text-white hover:bg-black shadow-xs transition-colors"
                >
                  Sign up
                </NextLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-900 text-white">
                {user.role}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <NextLink
              href="/services"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </NextLink>

            <div className="pt-2 pb-1 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Popular Categories
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {categories.map((cat) => (
                <NextLink
                  key={cat.name}
                  href={cat.href}
                  className="px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100"
                >
                  {cat.name}
                </NextLink>
              ))}
            </div>

            <NextLink
              href="/help"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              <span>Help & Support</span>
              <HelpCircle className="w-4 h-4 text-neutral-400" />
            </NextLink>

            {isAuthenticated ? (
              <>
                <div className="pt-2 pb-1 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Account
                </div>
                <NextLink
                  href="/dashboard/appointments"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span>My Appointments</span>
                </NextLink>
                <NextLink
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                  <span>Customer Dashboard</span>
                </NextLink>
                {user?.role === "admin" && (
                  <NextLink
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin Console</span>
                  </NextLink>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <NextLink
                  href="/sign-in"
                  className="w-full py-2.5 text-center rounded-xl border border-neutral-300 font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Log in
                </NextLink>
                <NextLink
                  href="/sign-up"
                  className="w-full py-2.5 text-center rounded-xl bg-neutral-900 text-white font-semibold hover:bg-black"
                >
                  Sign up
                </NextLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

