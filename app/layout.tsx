import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap"
});

export const metadata: Metadata = {
  title: "BaseSplitPay",
  description: "Split one ETH payment evenly across multiple recipients on Base"
};

const BASE_APP_ID_PLACEHOLDER = "BASE_APP_ID_PLACEHOLDER";
const TALENT_VERIFICATION_PLACEHOLDER = "TALENT_VERIFICATION_PLACEHOLDER";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="base:app_id" content="69cb813f2b941e5a2778682d" />
        <meta
          name="talentapp:project_verification"
          content="9f7626c10b64b0788d31bc3f1cd19adf25f55e6234a3646d61931e13d22bf66ea2d46a3b3cc48ab36ecff3286c0f68bdf0fcb564597c2485efecb9289db200e3"
        />
        <meta name="base:app_id:placeholder" content={BASE_APP_ID_PLACEHOLDER} />
        <meta name="talent:verification:placeholder" content={TALENT_VERIFICATION_PLACEHOLDER} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
