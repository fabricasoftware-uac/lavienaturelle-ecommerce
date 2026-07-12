import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { StoreProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from "@/supabase/types/server"
import './globals.css'
import { Navbar } from '@/components/navbar'



const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'La Vie Naturelle | Tienda de Productos Naturales',
  description: 'Descubre productos naturales premium - Shampoo, Acondicionador, Tónicos, Aceites y mas.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const role = data?.claims.app_metadata?.role || null
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <StoreProvider>
          <Navbar role={role} />
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  )
}
