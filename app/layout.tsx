import './globals.css';
import { Fira_Code } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="en" className={firaCode.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
