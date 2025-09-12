import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import EmergencyFloatingButton from '@/components/EmergencyFloatingButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SafeGuard - Women Safety App',
  description: 'Comprehensive personal safety app for women with emergency alerts, location sharing, and community safety features',
  keywords: 'women safety, emergency, SOS, location tracking, personal security',
  authors: [{ name: 'SafeGuard Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#dc2626',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="relative min-h-screen">
          <main className="pb-20">
            {children}
          </main>
          <EmergencyFloatingButton />
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 5000,
              style: {
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}