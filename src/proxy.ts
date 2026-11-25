import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Server-side route protection (Next.js 16 "proxy", formerly middleware).
 *
 * - Unauthenticated users are redirected to /sign-in for protected pages.
 * - Role verification happens on the server: customers cannot open /admin
 *   and admins are sent to their own dashboard, so changing the URL by hand
 *   does not grant access to another role's dashboard.
 * - Blocked / suspended users are signed out of protected pages.
 *
 * Note: full JWT + role verification for every API call also happens on the
 * Express server (verifyToken / verifyAdmin) and in the BFF proxy routes.
 */

type SessionUser = {
    role?: string;
    isBlocked?: boolean;
    status?: string;
};

// Pages that require an authenticated customer
const CUSTOMER_ROUTES = ["/dashboard"];

// Pages that require an authenticated admin
const ADMIN_ROUTES = ["/admin"];

function matches(pathname: string, routes: string[]): boolean {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const needsAdmin = matches(pathname, ADMIN_ROUTES);
    const needsCustomer = matches(pathname, CUSTOMER_ROUTES);
    const needsAuth = needsAdmin || needsCustomer;

    if (!needsAuth) {
        return NextResponse.next();
    }

    // Verify the session server-side (cookie cache / DB via Better Auth)
    let session: { user?: SessionUser } | null = null;
    try {
        session = await auth.api.getSession({ headers: request.headers });
    } catch {
        session = null;
    }

    const user = session?.user;

    if (!user) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (user.isBlocked || user.status === "suspended") {
        // Blocked users must not access protected platform features.
        const homeUrl = new URL("/", request.url);
        homeUrl.searchParams.set("blocked", "1");
        return NextResponse.redirect(homeUrl);
    }

    if (needsAdmin && user.role !== "admin") {
        // A customer changing the URL to /admin lands on their own dashboard.
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (needsCustomer && user.role === "admin") {
        // Admins must not use the customer dashboard.
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
