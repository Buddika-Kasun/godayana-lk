import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/lib/redux/Provider";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default:
      "Godayana.lk - Sri Lanka's Premier Platform for Global Opportunities",
    template: "%s | Godayana.lk",
  },
  description:
    "Sri Lanka's leading platform for global migration, job opportunities, and professional growth. Empowering youth to reach their global potential.",
  keywords: [
    "jobs in sri lanka",
    "overseas jobs",
    "migration",
    "visa services",
    "courses",
    "global opportunities",
  ],
  authors: [{ name: "Godayana.lk" }],
  creator: "Godayana.lk",
  publisher: "Godayana.lk",
  openGraph: {
    title: "Godayana.lk - Global Opportunities for Sri Lankans",
    description:
      "Find jobs, courses, visa services, and migration opportunities",
    url: "https://godayana.lk",
    siteName: "Godayana.lk",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Godayana.lk",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Godayana.lk - Global Opportunities",
    description:
      "Find jobs, courses, visa services, and migration opportunities",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    viewport:
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased overflow-x-hidden w-full max-w-[100vw]`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}