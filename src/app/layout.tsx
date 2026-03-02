import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Markdown Preview',
  description: 'Live Markdown preview web application with real-time rendering',
  keywords: ['markdown', 'preview', 'editor', 'live', 'real-time'],
  authors: [{ name: 'Markdown Preview App' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body className="bg-background text-foreground antialiased">
        <noscript>
          <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                JavaScript Required
              </h1>
              <p className="text-muted">
                This application requires JavaScript to function properly.
                Please enable JavaScript in your browser settings.
              </p>
            </div>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  )
}