import type { Metadata } from 'next';
import { IBM_Plex_Mono, Instrument_Sans, Schibsted_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { DevBanner } from '@/components/dev-banner';
import { ShellGate } from '@/components/shell-gate';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteUrl } from '@/lib/seo';
import { site } from '@/lib/site';

import './globals.css';

export const dynamic = 'force-dynamic';

// Every page's <title> is `<its metadata.title> · <site name>`; canonical URLs and social images resolve on siteUrl().
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(await siteUrl()),
    title: { default: `${site.name} · Scoring hipotecario embebible para intermediarios`, template: `%s · ${site.name}` },
    description: site.description,
    // the logo, else the name's initials on the brand colour (src/app/site-icon.svg): every site has an icon
    icons: { icon: site.logo || '/site-icon.svg' },
  };
}

// Grotesk con carácter para titulares, una sans neutra para texto y una mono para cifras y fórmulas.
const heading = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });
const data = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-data' });
const fonts = `${heading.variable} ${body.variable} ${data.variable}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={fonts} lang="es">
      <body className="flex min-h-dvh flex-col bg-white font-sans text-zinc-900 antialiased">
        {/* /embed es el widget dentro del iframe de otra web: sin cabecera, pie ni banner */}
        <ShellGate>
          <SiteHeader />
        </ShellGate>
        <div className="flex-1">{children}</div>
        <ShellGate>
          <SiteFooter />
          <DevBanner />
        </ShellGate>
      </body>
    </html>
  );
}
