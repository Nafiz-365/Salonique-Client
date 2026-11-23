import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [
        jwtClient(),
        inferAdditionalFields({
            user: { phone: { type: "string", required: false } },
        }),
    ],
});

export type AuthSession = typeof authClient.$Infer.Session;
