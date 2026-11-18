# Iscrizioni al Sabato sera adolescenti

Minisito per le iscrizioni alla serata adolescenti della Parrocchia San Pietro Apostolo di Valeggio sul Mincio
(sabato 28 novembre 2026, ore 20.00, Ricreatorio Parrocchiale GREST): cena, film e condivisione
per i ragazzi dalla III media alla III superiore.

Stessa grafica e stessa area riservata del sito del ritiro di Avvento (cartella principale del repository).
Usa lo **stesso progetto Supabase**: tabella `iscrizioni_adolescenti`, con gli stessi admin e le stesse password.

- **Pagina pubblica** (`/`): informazioni sulla serata e modulo (nome e cognome, annata, vengo a cena sì/no).
- **Area riservata** (`/admin`): elenco, totale a cena, download Excel, cancellazione.
- **Super admin**: in più modifica le iscrizioni e gestisce gli admin.

## Messa online su Vercel
1. Su [vercel.com/new](https://vercel.com/new) importa di nuovo il repository `ritiro-avvento`.
2. Dai al progetto il nome `sabato-adolescenti` e in **Root Directory** scegli la cartella `sabato-adolescenti`.
3. In **Environment Variables** aggiungi gli stessi valori del sito del ritiro:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Premi **Deploy**.
5. In Supabase, **Authentication → URL Configuration → Redirect URLs**, aggiungi
   `https://<indirizzo-del-nuovo-sito>/auth/callback` (serve per primo accesso e password dimenticata).

Le annate ammesse si modificano in `lib/evento.ts`.
