import FormIscrizione from "./FormIscrizione";
import { EVENTO } from "@/lib/evento";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="contenitore">
          <p className="etichetta etichetta-chiara">Catechesi · Avvento 2026</p>
          <h1>{EVENTO.titolo}</h1>
          <p className="hero-citazione">
            «Vegliate dunque, perché non sapete in quale giorno il Signore vostro verrà.»
            <span>Matteo 24,42</span>
          </p>
        </div>
      </section>

      <section className="contenitore sezione griglia-evento">
        <div>
          <p className="etichetta">L&apos;appuntamento</p>
          <h2>Prepariamoci insieme al Natale</h2>
          <p className="testo">
            Un pomeriggio di preghiera, ascolto e condivisione per iniziare il cammino di Avvento
            come comunità. Sono invitati i ragazzi di prima e seconda secondaria insieme ai loro
            genitori.
          </p>
          <dl className="dettagli">
            <div><dt>Quando</dt><dd>{EVENTO.data}</dd></div>
            <div><dt>Orario</dt><dd>Dalle 16.00 alle 19.00, con la Santa Messa delle 19.00</dd></div>
            <div><dt>Dove</dt><dd>{EVENTO.luogo}</dd></div>
            <div><dt>Per chi</dt><dd>{EVENTO.destinatari}</dd></div>
          </dl>
        </div>

        <div className="scheda" id="iscrizione">
          <p className="etichetta">Iscrizioni</p>
          <h2>Modulo di adesione</h2>
          <p className="nota">Compila un modulo per ogni ragazzo/a. I campi con * sono obbligatori.</p>
          <FormIscrizione />
        </div>
      </section>
    </>
  );
}
