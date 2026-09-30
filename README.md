# AutoTark research-agent

Frontend jääb Vite/React rakenduseks. Research-agent on eraldi Node/TypeScript backend-worker, mis kasutab PostgreSQL-i, vahetatavat web-search providerit ja LM Studio OpenAI-compatible API-t. LLM saab ainult allikateksti ning JSON extraction ülesande; SQL-i ega shelli tööriistu talle ei anta.

## Käivitamine

1. Paigalda sõltuvused: `npm install`.
2. Kopeeri `.env.example` failiks `.env`, lisa `DATABASE_URL` ja `TAVILY_API_KEY`.
3. Käivita PostgreSQL-is migratsioonid `db/migrations/001_research.sql`, `db/migrations/002_claim_language.sql`, `db/migrations/003_analysis_requests.sql` ja `db/migrations/004_vin.sql`.
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

Veebirakenduse analüüsivoog kasutab `VITE_RESEARCH_API_URL` aadressi. Arenduses käivita frontend `npm run dev`, research API `npm run research:api` ning worker käsuga `npm run research -- research-next`.

## Arhitektuur

- `backend/providers/market.ts`: `MarketSourceProvider`, käsitsi ja CSV sisend; Auto24 adapteri saab hiljem lisada ilma pipeline'i muutmata.
- `backend/providers/search.ts`: `SearchProvider`, praegu Tavily; API võti tuleb `.env` failist.
- `backend/research.ts`: otsing → fetch → deduplitseerimine → LM Studio extraction → valideerimine → repository kirjutamised.
- `backend/db.ts`: ainult kontrollitud, parameetritega PostgreSQL päringud.
- `backend/security.ts`: ainult HTTP(S), private-network/localhost blokeering, timeout ja response-size piirang.

## Testid

`npm run test:research` kontrollib normaliseerimist, source rankingut, range JSON valideerimist ja SSRF kaitset. Integratsioonitestid päris PostgreSQL/Tavily/LM Studio ühendusega tuleks lisada järgmises faasis.

