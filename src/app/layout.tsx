import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar, MobileSidebar } from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VPS Command Center',
  description: 'Self-hosted web dashboard for monitoring and managing a Linux VPS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-primary-text">
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6 pb-20 md:pb-6">
              {children}
            </div>
          </main>
        </div>
        
        {/* Mobile Navigation */}
        <MobileSidebar />
      </body>
    </html>
  )
}