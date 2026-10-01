# AutoTark research-agent

Frontend jääb Vite/React rakenduseks. Research-agent on eraldi Node/TypeScript backend-worker, mis kasutab PostgreSQL-i, vahetatavat web-search providerit ja LM Studio OpenAI-compatible API-t. LLM saab ainult allikateksti ning JSON extraction ülesande; SQL-i ega shelli tööriistu talle ei anta.

## Käivitamine

1. Paigalda sõltuvused: `npm install`.
2. Kopeeri `.env.example` failiks `.env`, lisa `DATABASE_URL` ja `TAVILY_API_KEY`.
3. Käivita PostgreSQL-is migratsioonid `db/migrations/001_research.sql` kuni `db/migrations/005_job_claims_saved_comparisons.sql`.
   Võid need käivitada ka käsuga `npm run db:migrate`.
4. Käivita LM Studio, lae Qwen3-Coder-Next või muu sobiv mudel ja ava OpenAI-compatible server aadressil `LM_STUDIO_BASE_URL`.

Ühe auto järjekorda lisamine:

```text
npm run research -- research-vehicle BMW G31 530d B57
```

Queue järgmise töö töötlemine:

```text
npm run research -- research-next
```

Kontrollimiseks: `research-pending` ja `research-status`. Workerit saab käivitada välise scheduleriga, kutsudes `research-next` korduvalt.

Veebirakenduse analüüsivoog kasutab `VITE_RESEARCH_API_URL` aadressi. Arenduses käivita frontend `npm run dev`, research API `npm run research:api` ning pidev worker käsuga `npm run research:worker`. Worker kontrollib PostgreSQL-i järjekorda vaikimisi iga 5 sekundi järel; intervalli saab muuta `RESEARCH_WORKER_INTERVAL_MS` muutujaga.

## Arhitektuur

- `backend/providers/market.ts`: `MarketSourceProvider`, käsitsi ja CSV sisend; Auto24 adapteri saab hiljem lisada ilma pipeline'i muutmata.
- `backend/providers/search.ts`: `SearchProvider`, praegu Tavily; API võti tuleb `.env` failist.
- `backend/research.ts`: otsing → fetch → deduplitseerimine → LM Studio extraction → valideerimine → repository kirjutamised.
- `backend/db.ts`: ainult kontrollitud, parameetritega PostgreSQL päringud.
- `backend/security.ts`: ainult HTTP(S), private-network/localhost blokeering, timeout ja response-size piirang.

## Testid

`npm run test:research` kontrollib normaliseerimist, source rankingut, range JSON valideerimist ja SSRF kaitset.

Päris kohaliku keskkonna integratsioonitestid käivituvad käsuga `RUN_INTEGRATION_TESTS=1 npm run test:research` (PowerShellis: `$env:RUN_INTEGRATION_TESTS='1'; npm run test:research`). Need eeldavad, et PostgreSQL, Research API ja LM Studio töötavad.

