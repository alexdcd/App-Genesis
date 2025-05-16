import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "🧠 VibePRD - AI-Powered Product Requirements Document Generator",
  description: "Transform your app idea into a comprehensive product requirements document with AI",
  keywords: ["PRD", "VibePRD", "Product Requirements", "AI", "Development", "Software Engineering"],
  authors: [{ name: "Alex DC" }],
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [
      {
        url: '/vibe_PRD.jpg',
        width: 1200,
        height: 630,
        alt: 'Vibe PRD Preview',
      },
    ],
    type: 'website',
    title: '🧠 VibePRD - AI-Powered Product Requirements Document Generator',
    description: 'Transform your app idea into a comprehensive product requirements document with AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🧠 VibePRD - AI-Powered Product Requirements Document Generator',
    description: 'Transform your app idea into a comprehensive product requirements document with AI',
    images: ['/vibe_PRD.jpg'],
  },
  other: {
    'msapplication-TileColor': '#ffffff',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
