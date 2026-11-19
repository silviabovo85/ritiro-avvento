import FormIscrizione from "./FormIscrizione";
import { EVENTO } from "@/lib/evento";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="contenitore">
          <p className="etichetta etichetta-chiara">Adolescenti · Avvento 2026</p>
          <h1>{EVENTO.titolo}</h1>
        </div>
      </section>

      <section className="contenitore sezione griglia-evento">
        <div>
          <p className="etichetta">L&apos;appuntamento</p>
          <h2>Sabato sera adolescenti</h2>
          <p className="testo">
            Svolgimento della serata: cena ore 20.00, segue film e tempo libero (fino alle 23).
          </p>
          <p className="testo">
            <strong>Termine iscrizioni: martedì 24 novembre</strong>
          </p>
          <dl className="dettagli">
            <div><dt>Data</dt><dd>{EVENTO.data}</dd></div>
            <div><dt>Ore 20.00</dt><dd>Cena, film e condivisione</dd></div>
            <div><dt>Dove</dt><dd>{EVENTO.luogo}</dd></div>
            <div><dt>Per chi</dt><dd>Annate 2013-2012-2011-2010</dd></div>
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
