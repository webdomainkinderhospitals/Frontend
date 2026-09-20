import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

// Display serif for headlines, neutral sans for everything read at length.
// Self-hosted by next/font: no render-blocking request to Google, no flash of
// invisible text, and no layout shift as the face swaps in.
const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata = {
  title: 'Kinder Hospitals — Medical Group · India · Singapore',
  description:
    "Kinder Medical Group (Kindorama Healthcare Pvt Ltd) — a multi-centre women's & children's healthcare network across India and Singapore. NABH accredited maternity, IVF, neonatology, and paediatrics. 6 lakh+ women treated, 13,000+ births since 2011.",
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.className+=" js";',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
