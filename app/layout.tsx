import type { Metadata } from "next";
import { AuthWrapper } from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "FlashTip Dashboard",
  description: "Creator tip analytics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
        />
      </head>
      <body style={{ margin: 0, background: "#F4F4F5" }}>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}


