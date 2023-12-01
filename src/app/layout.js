import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import GlobalState from '../context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ecommercery',
  description: 'An E-commerce demo app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalState>
          <Navbar />
          <main className='flex min-h-screen flex-col mt-[80px]'>{children}</main>
        </GlobalState>
      </body>
    </html>
  )
}
