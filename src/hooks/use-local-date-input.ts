"use client";

import { useSyncExternalStore } from "react";
import { toDateInputValue } from "@/lib/booking";

const subscribeToNothing = () => () => {};
const getServerSnapshot = () => "";

export function useLocalDateInputValue(offsetDays = 0): string {
    return useSyncExternalStore(
        subscribeToNothing,
        () => {
            const date = new Date();
            date.setDate(date.getDate() + offsetDays);
            return toDateInputValue(date);
        },
        getServerSnapshot,
    );
}
