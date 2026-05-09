import './globals.css';
import { Fira_Code } from 'next/font/google';
import type { Metadata } from 'next';

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'API Response Visualizer',
  description: 'Paste JSON and see UI instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body>{children}</body>
    </html>
  );
}
