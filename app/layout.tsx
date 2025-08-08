import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeuroCards - AI-Powered Smart Learning',
  description: 'Revolutionary flashcard app with AI-powered content generation and spaced repetition',
  keywords: 'flashcards, AI, learning, spaced repetition, study, education',
  authors: [{ name: 'NeuroCards Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neural-900 text-neural-100 min-h-screen`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-neural-900 via-neural-800 to-neural-900" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-ai-900/20" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            </div>
            
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'bg-neural-800 text-neural-100 border border-neural-700',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}