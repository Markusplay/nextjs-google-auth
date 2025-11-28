import { Providers } from "./providers";
import "./globals.css";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1a73e8" />
        <meta name="msapplication-navbutton-color" content="#1a73e8" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1a73e8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans&display=swap"
          rel="stylesheet"
        />
        <script src="https://accounts.google.com/gsi/client" async />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
