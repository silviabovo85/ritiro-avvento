# Iscrizioni al Ritiro di Avvento 2026

Sito per le iscrizioni al ritiro di Avvento della Parrocchia San Pietro Apostolo di Valeggio sul Mincio
(domenica 29 novembre 2026, dalle 16.30 alla Santa Messa delle 19.00).

- **Pagina pubblica** (`/`): informazioni sul ritiro e modulo di iscrizione.
- **Area riservata** (`/admin`): elenco delle iscrizioni e download del file Excel.
- **Super admin** (silviabovo85@gmail.com): in più può aggiungere e rimuovere gli admin.

L'accesso all'area riservata avviene con un link inviato via email (niente password).
Per aggiungere un admin basta inserire la sua email nel pannello: la volta successiva potrà
richiedere il link da "Area riservata".

Tecnologie: Next.js (hosting su Vercel) e Supabase (database e accesso).

## Messa online

### 1. Supabase
1. Crea un progetto su [supabase.com](https://supabase.com/dashboard) (regione Europa).
2. Apri **SQL Editor**, incolla il contenuto di [`supabase/schema.sql`](supabase/schema.sql) e premi **Run**.
3. In **Project Settings → API** copia **Project URL** e la chiave **anon / publishable**.

### 2. Vercel
1. Su [vercel.com/new](https://vercel.com/new) importa questo repository.
2. Prima di premere **Deploy**, in **Environment Variables** aggiungi:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chiave anon / publishable
3. Premi **Deploy** e annota l'indirizzo del sito (es. `https://ritiro-avvento.vercel.app`).

### 3. Collegare l'accesso via email
In Supabase, **Authentication → URL Configuration**:
- **Site URL**: l'indirizzo del sito su Vercel
- **Redirect URLs**: aggiungi `https://<indirizzo-del-sito>/auth/callback`

## Sviluppo locale

```bash
cp .env.example .env.local   # e inserisci i valori di Supabase
npm install
npm run dev
```

I dati dell'evento si modificano in `lib/evento.ts` e `app/page.tsx`.
