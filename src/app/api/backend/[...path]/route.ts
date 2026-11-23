import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

// Allowed public routes — no session required
const PUBLIC_ROUTES = [
    { method: "GET", pattern: /^\/services$/ },
    { method: "GET", pattern: /^\/featured-services$/ },
    { method: "GET", pattern: /^\/service\/[^/]+$/ },
];

function isPublicRoute(method: string, path: string): boolean {
    return PUBLIC_ROUTES.some(
        (r) => r.method === method && r.pattern.test(path),
    );
}

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    let targetUrl = "";
    const method = req.method;
    const forwardHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };
    let body: string | undefined;
    let requestBodyLoaded = method === "GET" || method === "HEAD";

    try {
        const { path } = await params;
        const backendPath = "/" + path.join("/");
        const search = req.nextUrl.search || "";
        targetUrl = `${API_BASE_URL}${backendPath}${search}`;

        const isPublic = isPublicRoute(method, backendPath);

        if (!isPublic) {
            // Need an authenticated session
            let session = null;
            try {
                // Try req.headers first, then fallback to await headers()
                session = await auth.api.getSession({ headers: req.headers });
                if (!session?.user) {
                    const headersList = await headers();
                    session = await auth.api.getSession({
                        headers: headersList,
                    });
                }

                if (!session?.user) {
                    return NextResponse.json(
                        {
                            error: "Unauthorized: Session not found or expired. Please sign in again.",
                        },
                        { status: 401 },
                    );
                }

                // Always set user email fallback header
                forwardHeaders["x-user-email"] = session.user.email;

                // Try to get JWT token
                try {
                    const tokenResponse = await auth.api.getToken({
                        headers: req.headers,
                    });
                    if (tokenResponse?.token) {
                        forwardHeaders["Authorization"] =
                            `Bearer ${tokenResponse.token}`;
                    }
                } catch {
                    // JWT plugin error — x-user-email fallback already set above
                }
            } catch (sessionErr) {
                console.error("[BFF Proxy] Session error:", sessionErr);
                return NextResponse.json(
                    { error: "Session error. Please sign in again." },
                    { status: 401 },
                );
            }
        }

        // Forward the request to Express
        if (!requestBodyLoaded) {
            body = await req.text();
            requestBodyLoaded = true;
        }

        const response = await fetch(targetUrl, {
            method,
            headers: forwardHeaders,
            body,
        });

        const data = await response.text();
        return new NextResponse(data, {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[BFF Proxy] Unhandled error:", error);

        // Windows IPv6 fallback: if localhost failed, retry on 127.0.0.1
        if (targetUrl.includes("localhost") && requestBodyLoaded) {
            try {
                const fallbackUrl = targetUrl.replace("localhost", "127.0.0.1");
                const fallbackRes = await fetch(fallbackUrl, {
                    method,
                    headers: forwardHeaders,
                    body,
                });
                const data = await fallbackRes.text();
                return new NextResponse(data, {
                    status: fallbackRes.status,
                    headers: { "Content-Type": "application/json" },
                });
            } catch {
                // Fallback also failed
            }
        }

        const msg =
            error instanceof Error
                ? error.message
                : "Failed to reach backend server";
        return NextResponse.json(
            {
                error: `Backend connection error: ${msg}. Make sure Express server is running on port 8000.`,
            },
            { status: 502 },
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const PUT = handler;
