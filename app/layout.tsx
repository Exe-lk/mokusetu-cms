import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MetaMaskErrorHandler } from "./components/MetaMaskErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MokuSetu CMS - Admin Dashboard",
  description: "Business Consultancy Content Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Suppress MetaMask errors early
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = function() {
                  const args = Array.from(arguments);
                  const message = args.join(' ');
                  if (message.includes('MetaMask') || 
                      message.includes('Failed to connect to MetaMask') ||
                      message.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) {
                    return;
                  }
                  originalError.apply(console, arguments);
                };
                
                console.warn = function() {
                  const args = Array.from(arguments);
                  const message = args.join(' ');
                  if (message.includes('MetaMask') || 
                      message.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) {
                    return;
                  }
                  originalWarn.apply(console, arguments);
                };
                
                // Handle unhandled promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  const errorMessage = event.reason?.message || event.reason?.toString() || '';
                  if (errorMessage.includes('MetaMask') || 
                      errorMessage.includes('Failed to connect') ||
                      errorMessage.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) {
                    event.preventDefault();
                  }
                });
              })();
            `,
          }}
        />
        <MetaMaskErrorHandler />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
