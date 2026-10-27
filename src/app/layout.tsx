import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Newsreader } from "next/font/google";
import { LiturgyProvider } from "@/components/LiturgyProvider";
import { site } from "@/content/site";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

const body = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — Code, Court, Ring & Altar`,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ecdf" },
    { media: "(prefers-color-scheme: dark)", color: "#14120e" },
  ],
};

// Runs before first paint: restores a saved theme and flags that JS is available
// (scroll-reveal animations only hide content when they can also show it again).
const bootScript = `(function(){var r=document.documentElement;r.dataset.js="1";try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")r.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <LiturgyProvider>{children}</LiturgyProvider>
      </body>
    </html>
  );
}
