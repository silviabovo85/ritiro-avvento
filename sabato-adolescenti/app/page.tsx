import FormIscrizione from "./FormIscrizione";
import { EVENTO } from "@/lib/evento";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="contenitore">
          <p className="etichetta etichetta-chiara">Adolescenti · Avvento 2026</p>
          <h1>{EVENTO.titolo}</h1>
          <p className="hero-citazione">
            «Voi siete la luce del mondo.»
            <span>Matteo 5,14</span>
          </p>
        </div>
      </section>

      <section className="contenitore sezione griglia-evento">
        <div>
          <p className="etichetta">L&apos;appuntamento</p>
          <h2>Una serata insieme</h2>
          <p className="testo">
            Incontro adolescenti dalla terza media alla terza superiore.
          </p>
          <p className="testo">
            Svolgimento della serata: cena alle ore 20.00, segue film e condivisione.
          </p>
          <dl className="dettagli">
            <div><dt>Quando</dt><dd>{EVENTO.data}, {EVENTO.orario}</dd></div>
            <div><dt>Programma</dt><dd>Cena alle 20.00, poi film e condivisione</dd></div>
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
