import { cn } from "cn";

type SaloniqueMarkProps = {
    className?: string;
    tone?: "dark" | "light";
};

export function SaloniqueMark({
    className,
    tone = "dark",
}: SaloniqueMarkProps) {
    const isLight = tone === "light";

    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            className={cn("size-9 shrink-0", className)}
            aria-hidden="true"
        >
            <rect
                width="40"
                height="40"
                rx="13"
                fill={isLight ? "#251E1C" : "#1A1715"}
                stroke={isLight ? "#3D332F" : "#2A2320"}
                strokeWidth="1"
            />
            <g
                stroke={isLight ? "#D8B485" : "#C5A880"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <path d="M20 7.5c4 3.8 5.1 6.7 0 10.8-5.1-4.1-4-7 0-10.8Z" />
                <path
                    d="M20 7.5c4 3.8 5.1 6.7 0 10.8-5.1-4.1-4-7 0-10.8Z"
                    transform="rotate(90 20 20)"
                />
                <path
                    d="M20 7.5c4 3.8 5.1 6.7 0 10.8-5.1-4.1-4-7 0-10.8Z"
                    transform="rotate(180 20 20)"
                />
                <path
                    d="M20 7.5c4 3.8 5.1 6.7 0 10.8-5.1-4.1-4-7 0-10.8Z"
                    transform="rotate(270 20 20)"
                />
            </g>
            <circle
                cx="20"
                cy="20"
                r="2"
                fill={isLight ? "#D8B485" : "#C5A880"}
            />
        </svg>
    );
}
