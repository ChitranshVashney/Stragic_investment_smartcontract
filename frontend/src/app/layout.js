import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import "@/styles/style.scss"
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Strategic Invest',
  description: 'A decentalized application for investing in crypto assets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
        <Navbar/>  
        {children}
        </body>
    </html>
  )
}
