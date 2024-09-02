import './globals.css';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My Quiz - schorn.ai',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>{children}</body>
    </html>
  );
}
