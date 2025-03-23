import MainHeader from '@/components/MainHeader/MainHeader';
import { ReactNode } from 'react';
import './globals.css';
import { Work_Sans } from 'next/font/google';
import { Metadata } from 'next';

const workSansFont = Work_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '700', '900'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Next Step',
  description: 'The Place to Make First Step to Dreams',
  icons: {
    icon: '/stairs.png',
    shortcut: '/stairs.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={workSansFont.className}>
        <header>
          <MainHeader />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
