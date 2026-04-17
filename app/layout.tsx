import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { StoreProvider } from '@/lib/store-context'
import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
