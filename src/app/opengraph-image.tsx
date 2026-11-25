import { ImageResponse } from "next/og";

export const alt = "Salonique — Salon & Beauty Services";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "radial-gradient(circle at 80% 20%, #5b4335 0, transparent 38%), #181212",
                    color: "#FDFBF7",
                    fontFamily: "serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        padding: "88px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                            color: "#D8B485",
                            fontSize: 28,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}
                    >
                        <span>Salonique</span>
                        <span
                            style={{
                                width: 64,
                                height: 2,
                                background: "#D8B485",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 46,
                            fontSize: 76,
                            lineHeight: 1.08,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Salon & Beauty
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 8,
                            fontSize: 76,
                            lineHeight: 1.08,
                            letterSpacing: "-0.03em",
                            color: "#E8D1B5",
                        }}
                    >
                        Services in New York
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 30,
                            color: "#D1C5BA",
                            fontFamily: "sans-serif",
                            fontSize: 26,
                        }}
                    >
                        Discover treatments. Find your moment.
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
