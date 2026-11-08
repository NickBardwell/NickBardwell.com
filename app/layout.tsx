import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club Hub | Find your people at LSUA",
  description: "Explore LSUA clubs, find your community, track applications, and propose a new organization.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
