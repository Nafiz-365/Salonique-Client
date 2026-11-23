export const BOOKING_TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "02:30 PM",
    "03:45 PM",
    "05:00 PM",
    "06:15 PM",
] as const;

export const SEARCH_TIME_OPTIONS = ["Any time", ...BOOKING_TIME_SLOTS] as const;

export function toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
