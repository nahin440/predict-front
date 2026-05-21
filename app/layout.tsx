import './globals.css'

export const metadata = {
  title: 'XAUUSD Predictor',
  description: 'Real-time XAUUSD predictions with 15-min horizon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}