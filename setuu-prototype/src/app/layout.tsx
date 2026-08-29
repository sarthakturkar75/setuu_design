import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from "@/components/ThemeProvider"
import { CurrencyProvider } from "@/contexts/CurrencyContext"
import { ToastProvider } from '@/contexts/ToastContext'
import { GlobalEmergencyListener } from '@/components/ui/GlobalEmergencyListener'
import OfflineSyncManager from '@/components/navigation/OfflineSyncManager'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Setuu Enterprise',
  description: 'Industrial Project Management Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable}`}>
      <body className="font-poppins bg-background text-on-background min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <CurrencyProvider><AuthProvider>
              <GlobalEmergencyListener />
              <OfflineSyncManager />
              {children}
            </AuthProvider></CurrencyProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
