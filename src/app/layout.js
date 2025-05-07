import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

import Script from "next/script";
import PaymentRequestDetails from "@/context/PaymentRequestDetails";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quantum Gatway",
  description: "Make Payments Easy",
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        src="https://pay-service.icadpay.com/host/new-inline-stage-pay.js"
        strategy="lazyOnload"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PaymentRequestDetails>
          <ToastContainer />
          <Script
            src="https://pay-service.icadpay.com/host/new-inline-stage-pay.js"
            strategy="lazyOnload"
          />
          {children}
        </PaymentRequestDetails>
      </body>
    </html>
  );
}
