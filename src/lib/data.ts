import { Review } from "./types";

// ─── Hardcoded Category Data (UI only - no DB needed) ─────────────────────────
export const CATEGORIES: { name: string; iconName: string; image: string }[] = [
  {
    name: "Hair",
    iconName: "Scissors",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Nails",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Facial",
    iconName: "Smile",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Massage",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Makeup",
    iconName: "Palette",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Brows & Lashes",
    iconName: "Eye",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Waxing",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Spa",
    iconName: "Waves",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
  },
];

// ─── Static Testimonials (UI only - displayed on homepage) ───────────────────
export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Sarah Jenkins",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 days ago",
    comment:
      "Booking with Salonique was genuinely seamless. Elena was so meticulous with my balayage — the tone is completely natural and bright. Salonique feels just as sleek and modern as booking on Fresha!",
    serviceName: "Signature Balayage & Blow Dry",
    verified: true,
  },
  {
    id: "rev-2",
    userName: "Jessica Zhao",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "1 week ago",
    comment:
      "The Russian manicure by Chloe is in a league of its own. My cuticles have never looked cleaner and three weeks in, there's not a single chip. Will be booking all my appointments here.",
    serviceName: "Luxury Russian Gel Manicure",
    verified: true,
  },
  {
    id: "rev-3",
    userName: "Maya Al-Mansoor",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Instant glass skin results from Dr. Laurent's HydraGlow facial! The appointment management in the customer dashboard made rescheduling so easy. High-end experience from start to finish.",
    serviceName: "HydraGlow Diamond Facial",
    verified: true,
  },
  {
    id: "rev-4",
    userName: "Olivia Bennett",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Marcus has magic hands! The hot stone deep tissue massage completely relieved months of desk posture tension. Easy payment process and super clean salon space.",
    serviceName: "Deep Tissue Hot Stone Massage",
    verified: true,
  },
];
