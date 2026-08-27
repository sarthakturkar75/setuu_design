import type { Metadata } from 'next'
import { Merriweather, Inter, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/contexts/ToastContext'
import { GlobalEmergencyListener } from '@/components/ui/GlobalEmergencyListener'
import OfflineSyncManager from '@/components/navigation/OfflineSyncManager'
import './globals.css'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
    <html lang="en" suppressHydrationWarning className={`${merriweather.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-inter bg-background text-on-background min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AuthProvider>
              <GlobalEmergencyListener />
              <OfflineSyncManager />
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
