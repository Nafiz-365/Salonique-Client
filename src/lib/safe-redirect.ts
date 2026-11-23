const APP_ORIGIN = "https://salonique.invalid";

export function getSafeCallbackPath(value: string | null): string | null {
    if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
        return null;
    }

    try {
        const url = new URL(value, APP_ORIGIN);
        if (url.origin !== APP_ORIGIN) return null;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return null;
    }
}
