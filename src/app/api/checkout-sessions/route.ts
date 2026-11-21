import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const appointmentId =
    body && typeof body === "object" && "appointmentId" in body
      ? body.appointmentId
      : null;
  if (typeof appointmentId !== "string" || !appointmentId.trim()) {
    return NextResponse.json(
      { error: "appointmentId is required." },
      { status: 400 },
    );
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to pay." }, { status: 401 });
    }
    if (session.user.role !== "customer") {
      return NextResponse.json(
        { error: "Only customer accounts can pay for appointments." },
        { status: 403 },
      );
    }

    const tokenResponse = await auth.api.getToken({ headers: request.headers });
    if (!tokenResponse?.token) {
      return NextResponse.json(
        { error: "Your session is not ready for secure checkout. Please sign in again." },
        { status: 401 },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenResponse.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: appointmentId.trim() }),
        cache: "no-store",
      },
    );
    const responseBody: unknown = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      const error =
        responseBody &&
        typeof responseBody === "object" &&
        "error" in responseBody &&
        typeof responseBody.error === "string"
          ? responseBody.error
          : "Could not start checkout.";
      return NextResponse.json(
        { error },
        { status: backendResponse.status },
      );
    }

    const checkoutUrl =
      responseBody &&
      typeof responseBody === "object" &&
      "url" in responseBody &&
      typeof responseBody.url === "string"
        ? responseBody.url
        : null;
    if (!checkoutUrl) {
      console.error("[Checkout] Backend returned no Stripe Checkout URL.");
      return NextResponse.json(
        { error: "Checkout could not be started. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("[Checkout] Failed to create checkout session:", error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
