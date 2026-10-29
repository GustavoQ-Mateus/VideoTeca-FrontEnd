import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SkipLink } from "@/components/ui/VisuallyHidden";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Videoteca Unifor",
  description: "Sistema de gestão da Videoteca da Universidade de Fortaleza — acervo audiovisual, reservas, empréstimos e eventos.",
  metadataBase: new URL("https://videoteca.unifor.br"),
};

// Sem maximum-scale/user-scalable: o zoom do usuário nunca é bloqueado (WCAG 1.4.4).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#003A70",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SkipLink />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
