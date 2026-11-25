import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create an Account",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SignUpRouteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
