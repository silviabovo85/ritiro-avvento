import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ritiro di Avvento 2026 · Parrocchia San Pietro Apostolo",
  description: "Iscrizioni al ritiro di Avvento del 29 novembre 2026 per i ragazzi di prima e seconda secondaria e i loro genitori.",
};

export const viewport = { themeColor: "#193764" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="salta" href="#contenuto">Salta al contenuto</a>
        <header className="testata" id="top">
          <div className="contenitore testata-inner">
            <Link href="/" className="marchio" aria-label="Parrocchia San Pietro Apostolo, Valeggio sul Mincio">
              <Image src="/logo-white.png" alt="Parrocchia San Pietro Apostolo · Valeggio sul Mincio" width={1828} height={334} priority className="marchio-logo" />
            </Link>
            <a className="testata-link" href="https://www.parrocchiavaleggio.it/">Sito della parrocchia ↗</a>
          </div>
        </header>

        <main id="contenuto">{children}</main>

        <footer className="piede">
          <div className="contenitore piede-griglia">
            <div>
              <Image src="/logo-white.png" alt="Parrocchia San Pietro Apostolo · Valeggio sul Mincio" width={1828} height={334} className="piede-logo" />
              <p className="piede-motto">Una comunità in cammino</p>
            </div>
            <div>
              <p className="etichetta etichetta-chiara">Dove siamo</p>
              <p>Vicolo Oratorio, 2<br />37067 Valeggio sul Mincio (VR)</p>
            </div>
            <div>
              <p className="etichetta etichetta-chiara">Contatti</p>
              <p>
                Tel. <a href="tel:+390457950031">045 7950031</a><br />
                <a href="mailto:info@parrocchiavaleggio.it">info@parrocchiavaleggio.it</a>
              </p>
            </div>
            <div>
              <p className="etichetta etichetta-chiara">Area riservata</p>
              <p>
                Per catechisti e organizzatori:<br />
                <Link href="/admin" className="piede-admin">Accedi al pannello admin →</Link>
              </p>
            </div>
          </div>
          <div className="contenitore piede-fondo">
            <span>© 2026 Parrocchia San Pietro Apostolo · Valeggio sul Mincio</span>
            <span className="piede-link">
              <a href="#top">Torna su ↑</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
