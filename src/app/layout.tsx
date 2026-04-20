import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plataforma TCC Interativa",
  description: "Automonitoramento RPD e Manejo de Impulsos GMT baseados em Terapia Cognitivo-Comportamental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
