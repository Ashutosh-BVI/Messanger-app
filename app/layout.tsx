import './globals.css'
import { Inter } from 'next/font/google';
import ToasterContext from"./context/TosterContext"; 
import AuthContext from './context/AuthContext';
import ActiveStatus from './components/ActiveStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Messanger App',
  description: 'Messanger app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
