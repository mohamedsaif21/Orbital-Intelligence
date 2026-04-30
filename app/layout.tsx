import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbital Intelligence | Encroachment Dashboard',
  description: 'Satellite-based land encroachment monitoring and telemetry dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
