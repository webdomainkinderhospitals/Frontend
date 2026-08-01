import './globals.css';

export const metadata = {
  title: 'Kinder Hospitals — Medical Group · India · Singapore',
  description:
    "Kinder Medical Group (Kindorama Healthcare Pvt Ltd) — a women's & children's healthcare network operating in Cherthala, Kochi, Bengaluru, Alappuzha, and Singapore. NABH accredited maternity, IVF, neonatology, and paediatrics. 6 lakh+ women treated, 13,000+ births since 2011.",
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.className+=" js";',
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
