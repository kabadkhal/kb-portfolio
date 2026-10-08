import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://kb-portfolio-puce.vercel.app";
const TITLE = "Kartik | Full-Stack & DevOps Engineer";
const DESC =
  "Portfolio of Kartik, a full-stack developer and DevOps engineer building products that ship and scale. Next.js, Kubernetes, Terraform and AWS.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  keywords: ["Kartik", "full-stack developer", "DevOps engineer", "Next.js", "Kubernetes", "Terraform", "AWS", "portfolio"],
  authors: [{ name: "Kartik" }],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE,
    siteName: "Kartik Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}