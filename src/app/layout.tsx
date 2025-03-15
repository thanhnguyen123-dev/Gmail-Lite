import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Provider from "./provider";
export const metadata: Metadata = {
  title: "Gmail Lite",
  description: "This is a lightweight Gmail wrapper.",
  icons: [{ rel: "icon", url: "/gmail.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <body className="w-full min-h-screen">
        <TRPCReactProvider>
          <Provider>{children}</Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
