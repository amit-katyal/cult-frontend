import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThirdwebProvider } from '@/components/web3/Web3Provider';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Cult - Celebrity Token Launchpad',
  description: 'Tokenizing Influence, Empowering Fans. Building bridges between creators and communities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />

        {/* Load React Query first */}
        <Script
          src="https://unpkg.com/@tanstack/react-query@5.0.0/build/umd/index.production.js"
          strategy="beforeInteractive"
        />
        
        {/* Ethers.js */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"
          strategy="beforeInteractive"
        />
        
        {/* Optional: Chart.js for token detail page */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/chart.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <ThirdwebProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThirdwebProvider>
      </body>
    </html>
  );
}