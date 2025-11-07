import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mamen Noticias",
  description: "Aplicación para aprobar o rechazar noticias de Mamen Saavedra reelvante para su posterior descarga de pdf del boletin de noticias aprobadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
