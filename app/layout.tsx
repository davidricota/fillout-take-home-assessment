import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FormBuilderProvider } from "@/contexts/form-builder-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Form Builder",
  description: "A powerful form builder application",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FormBuilderProvider>{children}</FormBuilderProvider>
      </body>
    </html>
  );
}
