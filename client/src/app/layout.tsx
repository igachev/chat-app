import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from '@clerk/nextjs/server';
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${inter.className} min-h-screen bg-yellow-500`}>

      <Header />

        <main className="">
        {children}
        </main>
    
        </body>
    </html>
    </ClerkProvider>
  );
}
