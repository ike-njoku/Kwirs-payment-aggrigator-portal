import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="icon"
          href="/images/interswitch.png"
          type="image/png"
          sizes="16x16"
        />
      </Head>
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
          {/* <Script
            src="https://newwebpay.qa.interswitchng.com/inline-checkout.js"
            strategy="beforeInteractive"
          /> */}

          {children}
        </PaymentRequestDetails>
      </body>
    </html>
  );
}
