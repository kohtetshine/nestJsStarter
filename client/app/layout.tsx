import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Minimalist authentication app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  );
}
